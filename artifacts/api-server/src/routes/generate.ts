import { Router, type IRouter } from "express";
import OpenAI from "openai";

const router: IRouter = Router();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

router.post("/generate", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { businessName, businessType, location, selectedItems, language } = req.body;

  if (!businessName || !businessType || !location || !selectedItems || !language) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (!Array.isArray(selectedItems) || selectedItems.length === 0) {
    res.status(400).json({ error: "selectedItems must be a non-empty array" });
    return;
  }

  const validLanguages = ["English", "Hindi", "Telugu"];
  if (!validLanguages.includes(language)) {
    res.status(400).json({ error: "Invalid language" });
    return;
  }

  try {
    const prompt = `You are a professional web designer.

Generate a complete modern website in ${language}.

Business Name: ${businessName}
Business Type: ${businessType}
Location: ${location}
Services: ${selectedItems.join(", ")}

Include:
- Hero section with a compelling headline and call-to-action button
- About section
- Services section showing each service as a card
- Contact section with address (${location}) and a contact form

Use simple, warm language suitable for local users.
Make it visually attractive with a professional color scheme.
Return ONLY clean HTML with inline CSS. No markdown, no backticks, just the raw HTML document.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 4000,
    });

    const html = completion.choices[0]?.message?.content ?? "";

    if (!html) {
      res.status(500).json({ error: "Failed to generate website content" });
      return;
    }

    res.json({ html });
  } catch (err) {
    req.log.error({ err }, "Failed to generate website");
    res.status(500).json({ error: "Failed to generate website. Please try again." });
  }
});

export default router;
