import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const generateWebsiteSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  location: z.string().min(1, "Location is required"),
  selectedItems: z.array(z.string()).min(1, "Select at least one service"),
  language: z.enum(["English", "Hindi", "Telugu"]),
});

export type GenerateWebsiteRequest = z.infer<typeof generateWebsiteSchema>;

export interface GenerateWebsiteResponse {
  html: string;
  usedFallback?: boolean;
}

async function generateViaStream(data: GenerateWebsiteRequest): Promise<GenerateWebsiteResponse> {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, "");
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Non-200 before SSE starts means auth/validation error
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed (${res.status})`);
  }

  // Read the SSE stream and collect the first data event
  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Parse SSE events from buffer
    const lines = buffer.split("\n");
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const jsonStr = line.slice(6).trim();
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr) as GenerateWebsiteResponse;
            if (parsed.html) {
              reader.cancel();
              return parsed;
            }
          } catch {
            // Keep reading if JSON is incomplete
          }
        }
      }
    }

    // Keep only the last incomplete line in buffer
    const lastNewline = buffer.lastIndexOf("\n");
    if (lastNewline >= 0) {
      buffer = buffer.slice(lastNewline + 1);
    }
  }

  throw new Error("No HTML content received from server");
}

export function useGenerateWebsite() {
  return useMutation({
    mutationFn: generateViaStream,
  });
}
