export type PostStatus = "draft" | "published";

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  status: PostStatus;
  featured: boolean;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
