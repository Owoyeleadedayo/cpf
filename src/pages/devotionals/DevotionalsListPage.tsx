import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { getSupabaseClient } from "../../lib/supabaseClient";
import type { Post } from "../../types/blog";
import { calculateReadingTime } from "../../utils/readingTime";

const PAGE_SIZE = 6;

type PostWithMeta = Post & {
  readingTime: number;
};

export default function DevotionalsListPage() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const searchTerm = searchParams.get("search") ?? "";
  const tagFilter = searchParams.get("tag") ?? "";

  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const supabase = await getSupabaseClient();
      const query = supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (searchTerm) {
        query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }

      if (tagFilter) {
        query.contains("tags", [tagFilter]);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      setPosts(
        (data ?? []).map((post: Post) => ({
          ...post,
          readingTime: calculateReadingTime(post.content),
        })),
      );
      setTotalPosts(count ?? 0);
    } catch (error) {
      console.error("Failed to load devotionals", error);
      toast.error("Unable to load devotionals. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, searchTerm, tagFilter]);

  useEffect(() => {
    (async () => {
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from("posts")
          .select("tags")
          .eq("status", "published");

        if (error) throw error;

        const tagSet = new Set<string>();
        (data ?? []).forEach((row: { tags?: string[] | null }) => {
          (row.tags ?? []).forEach((tag) => tagSet.add(tag));
        });
        setAvailableTags(Array.from(tagSet).sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.error("Failed to load tags", err);
      }
    })();
  }, []);

  const handleSearchSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const term = (formData.get("search") as string) ?? "";
    setSearchParams((params: URLSearchParams) => {
      params.set("page", "1");
      if (term) {
        params.set("search", term);
      } else {
        params.delete("search");
      }
      return params;
    });
  };

  const handleTagChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const value = event.target.value;
    setSearchParams((params: URLSearchParams) => {
      params.set("page", "1");
      if (value) {
        params.set("tag", value);
      } else {
        params.delete("tag");
      }
      return params;
    });
  };

  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }, [totalPages]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Devotionals | Covenant People Fellowship</title>
        <meta name="description" content="Browse devotionals by Covenant People Fellowship." />
      </Helmet>

      <header className="bg-secondary py-16">
        <div className="container mx-auto flex max-w-5xl flex-col gap-6 px-4 text-center md:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Devotionals</p>
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">Feed on the Word</h1>
          <p className="text-base text-muted-foreground md:text-lg">
            Explore our archive of devotionals to stay encouraged, inspired, and grounded in Scripture.
          </p>
        </div>
      </header>

      <section className="container mx-auto max-w-5xl px-4 py-10">
        <form onSubmit={handleSearchSubmit} className="grid gap-4 rounded-2xl border border-muted bg-white p-6 shadow-sm md:grid-cols-[3fr_2fr_auto]">
          <label className="flex flex-col items-start gap-2 text-left">
            <span className="text-sm font-semibold text-muted-foreground">Search devotionals</span>
            <input
              type="search"
              name="search"
              defaultValue={searchTerm}
              placeholder="Search by title or excerpt"
              className="w-full rounded-lg border border-muted px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>

          <label className="flex flex-col items-start gap-2 text-left">
            <span className="text-sm font-semibold text-muted-foreground">Filter by tag</span>
            <select
              name="tag"
              value={tagFilter}
              onChange={handleTagChange}
              className="w-full rounded-lg border border-muted px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">All tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className="self-end rounded-lg bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Search
          </button>
        </form>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {isLoading && (
            <div className="col-span-full rounded-xl border border-muted bg-white p-10 text-center text-muted-foreground">
              Loading devotionals…
            </div>
          )}

          {!isLoading && posts.length === 0 && (
            <div className="col-span-full rounded-xl border border-muted bg-white p-10 text-center text-muted-foreground">
              No devotionals found. Try adjusting your filters.
            </div>
          )}

          {posts.map((post) => (
            <article key={post.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-muted bg-white shadow-sm transition hover:shadow-lg focus-within:shadow-lg">
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="h-56 w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-56 w-full items-center justify-center bg-muted text-muted-foreground">No cover image</div>
              )}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  {post.published_at && (
                    <time dateTime={post.published_at}>
                      {new Intl.DateTimeFormat(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(post.published_at))}
                    </time>
                  )}
                  <span aria-hidden="true">•</span>
                  <span>{post.readingTime} min read</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  <Link
                    to={`/devotionals/${post.slug}`}
                    className="hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/devotionals/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Continue reading
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                setSearchParams((params: URLSearchParams) => {
                  params.set("page", String(pageNumber));
                  return params;
                })
              }
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                pageNumber === page ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-primary/10"
              }`}
              aria-current={pageNumber === page}
            >
              {pageNumber}
            </button>
          ))}
        </nav>
      </section>
    </div>
  );
}
