import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

function buildFallbackHtml(
  businessName: string,
  businessType: string,
  location: string,
  services: string[],
  language: string,
): string {
  const isHindi = language === "Hindi";
  const isTelugu = language === "Telugu";

  const heroTitle = isHindi
    ? `${businessName} में आपका स्वागत है`
    : isTelugu
      ? `${businessName}కు స్వాగతం`
      : `Welcome to ${businessName}`;

  const servicesLabel = isHindi ? "हमारी सेवाएं" : isTelugu ? "మా సేవలు" : "Our Services";
  const contactLabel = isHindi ? "हमसे संपर्क करें" : isTelugu ? "మమ్మల్ని సంప్రదించండి" : "Contact Us";
  const locationLabel = isHindi ? "पता" : isTelugu ? "చిరునామా" : "Address";

  const serviceCards = services
    .map(
      (s) => `<div style="background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 8px rgba(0,0,0,0.08);text-align:center;">
        <div style="font-size:32px;margin-bottom:12px;">✅</div>
        <h3 style="margin:0;color:#1e293b;font-size:16px;">${s}</h3>
      </div>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; color: #334155; background: #f8fafc; }
    header { background: linear-gradient(135deg, #2563eb, #16a34a); color: white; padding: 80px 24px; text-align: center; }
    header h1 { font-size: clamp(28px, 5vw, 52px); font-weight: 800; margin-bottom: 12px; }
    header p { font-size: 18px; opacity: 0.9; }
    section { max-width: 960px; margin: 0 auto; padding: 60px 24px; }
    h2 { font-size: 28px; font-weight: 700; color: #1e293b; margin-bottom: 32px; text-align: center; }
    .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .contact-box { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); max-width: 500px; margin: 0 auto; }
    .contact-box p { margin-bottom: 12px; font-size: 16px; }
    footer { background: #1e293b; color: #94a3b8; text-align: center; padding: 24px; font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <h1>${heroTitle}</h1>
    <p>${businessType} &mdash; ${location}</p>
  </header>

  <section>
    <h2>${servicesLabel}</h2>
    <div class="services-grid">${serviceCards}</div>
  </section>

  <section style="background:#eff6ff; border-radius:20px; margin:0 auto 60px; max-width:960px; padding:60px 24px;">
    <h2>${contactLabel}</h2>
    <div class="contact-box">
      <p><strong>${locationLabel}:</strong> ${location}</p>
      <p><strong>Business:</strong> ${businessName}</p>
    </div>
  </section>

  <footer>
    <p>&copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

router.post("/generate", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { businessName, businessType, location, selectedItems, language } = req.body;

  console.log("[generate] incoming request:", {
    businessName,
    businessType,
    location,
    language,
    selectedItemsCount: Array.isArray(selectedItems) ? selectedItems.length : "not-array",
  });

  if (!businessName || !businessType || !location || !selectedItems || !language) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    res.status(400).json({ error: "selectedItems must be a non-empty array" });
    return;
  }

  const validLanguages = ["English", "Hindi", "Telugu"];
  const resolvedLanguage = validLanguages.includes(language) ? language : "English";

  const prompt = `You are a professional web designer. Create a complete, beautiful single-page website for a local Indian business.

Business Name: ${businessName}
Business Type: ${businessType}
Location: ${location}
Services/Products: ${selectedItems.join(", ")}
Language: Write ALL text content in ${resolvedLanguage}.

Requirements:
1. A hero section with a bold headline and a call-to-action button
2. An about section
3. A services section showing each service as a card
4. A contact section with the address (${location})
5. A footer

Design rules:
- Use a blue and green color scheme
- Use modern, clean inline CSS only (no external stylesheets or scripts)
- Responsive with mobile-friendly layout
- Professional and visually attractive

IMPORTANT: Return ONLY the raw HTML. No markdown, no code fences, no explanations. Start directly with <!DOCTYPE html>.`;

  // Use SSE streaming to keep the connection alive and avoid proxy timeouts
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    console.log("[generate] starting OpenAI streaming call with model gpt-5-mini");

    const stream = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 8192,
      stream: true,
    });

    let fullHtml = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? "";
      fullHtml += content;
    }

    console.log("[generate] streaming complete, html length:", fullHtml.length);

    const cleanHtml = fullHtml
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const finalHtml = cleanHtml.startsWith("<!") ? cleanHtml : buildFallbackHtml(
      businessName,
      businessType,
      location,
      selectedItems,
      resolvedLanguage,
    );

    res.write(`data: ${JSON.stringify({ html: finalHtml })}\n\n`);
    res.end();
  } catch (err: unknown) {
    const error = err as { message?: string; status?: number };
    console.error("[generate] OpenAI call failed:", error.message, "status:", error.status);

    // Send fallback HTML on any AI error — never leave the user with nothing
    const fallbackHtml = buildFallbackHtml(
      businessName,
      businessType,
      location,
      selectedItems,
      resolvedLanguage,
    );
    res.write(`data: ${JSON.stringify({ html: fallbackHtml, usedFallback: true })}\n\n`);
    res.end();
  }
});

export default router;
