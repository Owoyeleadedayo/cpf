import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { getSupabaseClient } from "../../lib/supabaseClient";
import type { Post, PostStatus } from "../../types/blog";

interface PostWithMeta extends Post {
  author_email?: string;
}

export default function AdminPostsList() {
  const [posts, setPosts] = useState<PostWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const supabase = await getSupabaseClient();
      const query = supabase
        .from("posts")
        .select("*")
        .order("updated_at", { ascending: false });

      if (statusFilter !== "all") {
        query.eq("status", statusFilter);
      }

      if (searchTerm) {
        query.or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data ?? []);
    } catch (error) {
      console.error("Failed to load posts", error);
      toast.error("Unable to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post? This action cannot be undone.")) return;
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Unable to delete post");
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      const supabase = await getSupabaseClient();
      const nextStatus: PostStatus = post.status === "published" ? "draft" : "published";
      const updates: Partial<Post> = {
        status: nextStatus,
        published_at: nextStatus === "published" ? new Date().toISOString() : null,
      };

      if (nextStatus === "published" && !post.content) {
        toast.error("Cannot publish without content");
        return;
      }

      const { error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", post.id);

      if (error) throw error;

      toast.success(nextStatus === "published" ? "Post published" : "Post moved to draft");
      setPosts((prev) =>
        prev.map((item) => (item.id === post.id ? { ...item, ...updates } : item)),
      );
    } catch (error) {
      console.error("Failed to toggle publish", error);
      toast.error("Unable to update post status");
    }
  };

  const handleToggleFeatured = async (post: Post) => {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from("posts")
        .update({ featured: !post.featured })
        .eq("id", post.id);

      if (error) throw error;
      toast.success(!post.featured ? "Marked as featured" : "Removed from featured");
      setPosts((prev) =>
        prev.map((item) => (item.id === post.id ? { ...item, featured: !item.featured } : item)),
      );
    } catch (error) {
      console.error("Failed to toggle feature", error);
      toast.error("Unable to update featured flag");
    }
  };

  const filteredPosts = useMemo(() => posts, [posts]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Posts</h2>
          <p className="text-sm text-muted-foreground">Manage devotionals, update statuses, and feature posts.</p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          + New post
        </Link>
      </header>

      <div className="grid gap-4 rounded-3xl border border-muted bg-white p-6 shadow-sm md:grid-cols-[2fr_1fr_auto]">
        <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
          Search
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by title or excerpt"
            className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as PostStatus | "all")}
            className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <button
          type="button"
          onClick={fetchPosts}
          className="self-end rounded-full border border-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {loading && (
          <div className="rounded-3xl border border-muted bg-white p-10 text-center text-muted-foreground">
            Loading posts…
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="rounded-3xl border border-muted bg-white p-10 text-center text-muted-foreground">
            No posts found.
          </div>
        )}

        {filteredPosts.map((post) => (
          <article key={post.id} className="rounded-3xl border border-muted bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <span className={`rounded-full px-2 py-1 ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {post.status}
                  </span>
                  {post.featured && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">Featured</span>
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {post.tags?.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-1 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(post.updated_at).toLocaleString()}
                  {post.published_at && ` • Published ${new Date(post.published_at).toLocaleString()}`}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/devotionals/${post.slug}`}
                    className="rounded-full border border-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Link>
                  <Link
                    to={`/admin/posts/${post.id}`}
                    className="rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Edit
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(post)}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {post.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(post)}
                    className="rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {post.featured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="rounded-full border border-red-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
