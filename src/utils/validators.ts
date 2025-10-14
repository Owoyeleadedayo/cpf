import { z } from "zod";

export const postBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().min(30, "Excerpt must be at least 30 characters"),
  tags: z.array(z.string().min(1)).default([]),
  cover_image_url: z
    .union([
      z.string().url({ message: "Cover image must be a valid URL" }),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((value) => (value === "" ? null : value)),
  content: z.string().optional().default(""),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().default(false),
  author_id: z.string().uuid().optional(),
  published_at: z.string().nullable().optional(),
});

export const draftPostSchema = postBaseSchema.extend({
  content: z.string().optional().default(""),
});

export const publishPostSchema = postBaseSchema.extend({
  content: z.string().min(1, "Content is required to publish"),
});

export type PostFormValues = z.infer<typeof postBaseSchema>;
