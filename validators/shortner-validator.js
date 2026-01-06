import z from "zod";

export const shortnerSchema = z.object({
  url: z.string().trim().url({ message: "Invalid URL" }).max(200, {
    message: "URL must be at most 200 characters long",
  }),
  shortCode: z
    .string()
    .trim()
    .min(2, { message: "Short code must be at least 2 characters long" }),
});
