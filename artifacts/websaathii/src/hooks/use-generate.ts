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
}

export function useGenerateWebsite() {
  return useMutation({
    mutationFn: async (data: GenerateWebsiteRequest) => {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate website");
      }
      
      return res.json() as Promise<GenerateWebsiteResponse>;
    },
  });
}
