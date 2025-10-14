import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import { getSupabaseClient } from "../../lib/supabaseClient";
import type { Post } from "../../types/blog";
import { calculateReadingTime } from "../../utils/readingTime";

interface PostWithMeta extends Post {
  readingTime: number;
}

export default function DevotionalDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const previewMode = searchParams.get("preview") === "1";
  const [post, setPost] = useState<PostWithMeta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const supabase = await getSupabaseClient();
        const query = supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .limit(1);

        if (!previewMode) {
          query.eq("status", "published");
        }

        const { data, error } = await query.single();
        if (error) throw error;
        setPost({
          ...data,
          readingTime: calculateReadingTime(data.content),
        });
      } catch (error) {
        console.error("Failed to load devotional", error);
        toast.error("Unable to load devotional.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, previewMode]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Loading devotional…</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
        <Helmet>
          <title>Devotional not found | Covenant People Fellowship</title>
        </Helmet>
        <h1 className="text-3xl font-bold text-foreground">Devotional not found</h1>
        <p className="max-w-xl text-muted-foreground">
          We couldn’t find the devotional you’re looking for. It may have been moved or unpublished.
        </p>
        <Link
          to="/devotionals"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to devotionals
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | Covenant People Fellowship</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <header className="bg-secondary">
        <div className="container mx-auto flex max-w-4xl flex-col gap-6 px-4 py-16">
          <Link
            to="/devotionals"
            className="text-sm font-semibold uppercase tracking-wide text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            ← Back to devotionals
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Devotional</p>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.published_at && (
              <time dateTime={post.published_at}>
                {new Intl.DateTimeFormat(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(new Date(post.published_at))}
              </time>
            )}
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} min read</span>
            {previewMode && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Preview mode</span>}
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Post tags">
            {post.tags?.map((tag) => (
              <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {post.cover_image_url && (
        <div className="bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="h-auto w-full rounded-3xl object-cover shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      )}

      <section className="container mx-auto max-w-4xl px-4 py-12">
        <div
          className="prose prose-lg max-w-none text-foreground prose-headings:font-semibold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>
    </article>
  );
}
