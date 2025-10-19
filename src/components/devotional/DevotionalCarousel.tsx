import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { getSupabaseClient } from "../../lib/supabaseClient";
import type { Post } from "../../types/blog";
import { calculateReadingTime } from "../../utils/readingTime";

interface CarouselPost extends Post {}

const AUTOPLAY_INTERVAL = 8000;
const SWIPE_THRESHOLD = 40;

export function DevotionalCarousel() {
  const [posts, setPosts] = useState<CarouselPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hoverRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = await getSupabaseClient();
      const { data, error: fetchError } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "published")
        .eq("featured", true)
        .order("published_at", { ascending: false })
        .limit(5);

      if (fetchError) throw fetchError;
      if (mountedRef.current) {
        setPosts(data ?? []);
        setCurrentIndex(0);
        setError(null);
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("Failed to load carousel posts", err);
      setError("Unable to load featured devotionals right now.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchPosts();

    (async () => {
      try {
        const supabase = await getSupabaseClient();
        const channel = supabase
          .channel("devotional-carousel")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "posts",
            },
            (payload: any) => {
              const becameRelevant =
                payload.new?.featured || payload.old?.featured;
              const statusChanged =
                payload.new?.status === "published" ||
                payload.old?.status === "published";
              if (becameRelevant || statusChanged) {
                fetchPosts();
              }
            },
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.warn("Realtime subscription failed", err);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchPosts]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (posts.length ? (prev + 1) % posts.length : prev));
  }, [posts.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      posts.length ? (prev - 1 + posts.length) % posts.length : prev,
    );
  }, [posts.length]);

  useEffect(() => {
    if (!posts.length) return;

    if (autoplayRef.current) clearInterval(autoplayRef.current);

    autoplayRef.current = setInterval(() => {
      if (!hoverRef.current) {
        handleNext();
      }
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [posts.length, handleNext]);

  const handleMouseEnter = () => {
    hoverRef.current = true;
  };

  const handleMouseLeave = () => {
    hoverRef.current = false;
  };

  const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (event) => {
    touchStartRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (event) => {
    if (touchStartRef.current == null) return;
    const delta = event.changedTouches[0]?.clientX - touchStartRef.current;
    if (!delta) return;
    if (delta > SWIPE_THRESHOLD) {
      handlePrevious();
    } else if (delta < -SWIPE_THRESHOLD) {
      handleNext();
    }
    touchStartRef.current = null;
  };

  const formattedPosts = useMemo(() => {
    return posts.map((post) => ({
      ...post,
      formattedDate: post.published_at
        ? new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(post.published_at))
        : "",
      readingTime: calculateReadingTime(post.content),
    }));
  }, [posts]);

  if (loading) {
    return (
      <section className="w-full bg-secondary py-12" aria-label="Devotional highlights loading">
        <div className="container mx-auto flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading featured devotionals…</p>
        </div>
      </section>
    );
  }

  if (error || !formattedPosts.length) {
    return (
      <section className="w-full bg-secondary py-12" aria-label="Devotional highlights">
        <div className="container mx-auto text-center">
          <p className="text-base text-muted-foreground">{error ?? "Featured devotionals will appear here once they are published."}</p>
        </div>
      </section>
    );
  }

  const activePost = formattedPosts[currentIndex];

  return (
    <section
      className="relative w-full overflow-hidden bg-secondary"
      aria-roledescription="carousel"
      aria-label="Featured devotionals"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto flex flex-col gap-8 py-12">
        <header className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Featured Devotionals</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Nourish your spirit with recent reflections</h2>
        </header>

        <div
          className="relative flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-xl md:flex-row"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") handleNext();
            if (event.key === "ArrowLeft") handlePrevious();
          }}
        >
          <article className="flex-1 space-y-4">
            <div className="overflow-hidden rounded-2xl">
              {activePost.cover_image_url ? (
                <img
                  src={activePost.cover_image_url}
                  alt={activePost.title}
                  className="h-64 w-full object-cover object-center"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-muted text-muted-foreground">
                  <span>No image available</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {activePost.formattedDate && <span>{activePost.formattedDate}</span>}
              <span aria-hidden="true">•</span>
              <span>{activePost.readingTime} min read</span>
            </div>
            <h3 className="text-2xl font-semibold text-foreground md:text-3xl">
              <Link to={`/devotionals/${activePost.slug}`} className="hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                {activePost.title}
              </Link>
            </h3>
            <p className="text-base text-muted-foreground md:text-lg">{activePost.excerpt}</p>
            <div className="flex flex-wrap gap-2" aria-label="Post tags">
              {activePost.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
                  {tag}
                </span>
              ))}
            </div>
            <Link
              to={`/devotionals/${activePost.slug}`}
              className="inline-flex items-center gap-2 text-base font-semibold text-primary transition hover:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Read devotional
              <span aria-hidden="true">→</span>
            </Link>
          </article>

          <nav className="flex flex-col justify-between gap-6 md:w-1/3" aria-label="Carousel navigation">
            <ul className="flex flex-col gap-4">
              {formattedPosts.map((post, index) => {
                const isActive = index === currentIndex;
                return (
                  <li key={post.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isActive ? "border-primary bg-primary/10" : "border-muted bg-white hover:border-primary/60"}`}
                      aria-current={isActive}
                    >
                      <p className="text-sm font-medium uppercase tracking-wide text-primary">{post.formattedDate}</p>
                      <p className="mt-2 text-base font-semibold text-foreground">{post.title}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                className="rounded-full border border-muted bg-white p-3 text-primary transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Previous devotional"
              >
                ‹
              </button>
              <div className="flex items-center gap-2" role="tablist" aria-label="Slide indicators">
                {formattedPosts.map((_post, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`h-2.5 w-2.5 rounded-full transition ${index === currentIndex ? "bg-primary" : "bg-muted"}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-pressed={index === currentIndex}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full border border-muted bg-white p-3 text-primary transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Next devotional"
              >
                ›
              </button>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
