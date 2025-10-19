import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useBlocker, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { RichTextEditor } from "../../components/admin/RichTextEditor";
import { getSupabaseClient } from "../../lib/supabaseClient";
import { slugify } from "../../utils/slugify";
import { draftPostSchema, publishPostSchema } from "../../utils/validators";
import type { PostStatus } from "../../types/blog";

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  coverImageUrl: string;
  content: string;
  status: PostStatus;
  featured: boolean;
}

const defaultState: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  tags: "",
  coverImageUrl: "",
  content: "",
  status: "draft",
  featured: false,
};

export default function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mode: "create" | "edit" = id ? "edit" : "create";

  const [formState, setFormState] = useState<FormState>(defaultState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const initialStateRef = useRef<FormState | null>(null);

  const isDirty = useMemo(() => {
    if (!initialStateRef.current) return false;
    return JSON.stringify(formState) !== JSON.stringify(initialStateRef.current);
  }, [formState]);

  const blocker = useBlocker(isDirty);
  useEffect(() => {
    if (blocker.state === "blocked") {
      const confirmLeave = window.confirm("You have unsaved changes. Leave this page?");
      if (confirmLeave) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  useEffect(() => {
    if (mode === "create") {
      initialStateRef.current = defaultState;
      return;
    }

    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!mounted) return;

        const tags = Array.isArray(data.tags) ? data.tags.join(", ") : "";
        const coverImageUrl = data.cover_image_url ?? "";
        const state: FormState = {
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          tags,
          coverImageUrl,
          content: data.content ?? "",
          status: data.status ?? "draft",
          featured: Boolean(data.featured),
        };
        initialStateRef.current = state;
        setFormState(state);
      } catch (error) {
        console.error("Failed to load post", error);
        toast.error("Unable to load post");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, mode]);

  const tagsArray = formState.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    updateField("title", value);
    if (!slugManuallyEdited) {
      updateField("slug", slugify(value));
    }
  };

  const handleSlugChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSlugManuallyEdited(true);
    updateField("slug", slugify(event.target.value));
  };

  const handleCoverUpload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const supabase = await getSupabaseClient();
      const fileExt = file.name.split(".").pop();
      const cleanFileName = slugify(file.name.replace(/\.[^/.]+$/, ""));
      const fileName = `${Date.now()}-${cleanFileName}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error } = await supabase.storage.from("blog-images").upload(filePath, file, {
        upsert: true,
        cacheControl: "3600",
        contentType: file.type || undefined,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);
      updateField("coverImageUrl", data.publicUrl);
      toast.success("Cover image uploaded");
    } catch (error) {
      const message = (error instanceof Error && error.message) ? error.message : "Image upload failed";
      console.error("Failed to upload image", error);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const validateSlug = async (slug: string) => {
    const supabase = await getSupabaseClient();
    const query = supabase.from("posts").select("id").eq("slug", slug);
    if (mode === "edit" && id) {
      query.neq("id", id);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).length === 0;
  };

  const resetDirtyState = (nextState: FormState) => {
    initialStateRef.current = nextState;
    setFormState(nextState);
    setSlugManuallyEdited(true);
  };

  const handleSave = async (targetStatus: PostStatus) => {
    setSaving(true);
    setErrorMessage(null);
    try {
      const payload = {
        title: formState.title.trim(),
        slug: formState.slug.trim(),
        excerpt: formState.excerpt.trim(),
        tags: tagsArray,
        cover_image_url: formState.coverImageUrl || null,
        content: formState.content,
        status: targetStatus,
        featured: formState.featured,
        published_at: targetStatus === "published" ? new Date().toISOString() : null,
      };

      const validator = targetStatus === "published" ? publishPostSchema : draftPostSchema;
      const validation = validator.safeParse(payload);
      if (!validation.success) {
        const message = validation.error.issues[0]?.message ?? "Validation error";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      const slugAvailable = await validateSlug(payload.slug);
      if (!slugAvailable) {
        const message = "Slug is already in use. Try a different title.";
        setErrorMessage(message);
        toast.error(message);
        return;
      }

      const supabase = await getSupabaseClient();
      if (mode === "create") {
        const { data, error } = await supabase
          .from("posts")
          .insert([{ ...payload }])
          .select()
          .single();
        if (error) throw error;
        toast.success(targetStatus === "published" ? "Post published" : "Draft saved");
        const tags = payload.tags.join(", ");
        resetDirtyState({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          tags,
          coverImageUrl: data.cover_image_url ?? "",
          content: data.content ?? "",
          status: data.status,
          featured: data.featured,
        });
        navigate(`/admin/posts/${data.id}`, { replace: true });
      } else if (id) {
        const { data, error } = await supabase
          .from("posts")
          .update({ ...payload })
          .eq("id", id)
          .select()
          .single();
        if (error) throw error;
        toast.success(targetStatus === "published" ? "Post updated & published" : "Draft updated");
        const tags = payload.tags.join(", ");
        resetDirtyState({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          tags,
          coverImageUrl: data.cover_image_url ?? "",
          content: data.content ?? "",
          status: data.status,
          featured: data.featured,
        });
      }
    } catch (error) {
      console.error("Failed to save post", error);
      toast.error("Unable to save post");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    const baseUrl = `/devotionals/${formState.slug}`;
    const previewUrl = formState.status === "published" ? baseUrl : `${baseUrl}?preview=1`;
    window.open(previewUrl, "_blank");
  };

  return (
    <section className="space-y-6">
      <Helmet>
        <title>{mode === "edit" ? `Edit Post` : `New Post`} | Covenant People Fellowship</title>
      </Helmet>
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{mode === "edit" ? "Edit post" : "Create a new post"}</h2>
          <p className="text-sm text-muted-foreground">Craft devotionals, manage metadata, and publish with confidence.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePreview}
            className="rounded-full border border-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            disabled={!formState.slug}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formState.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-800" role="alert">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-muted bg-white p-10 text-center text-muted-foreground">Loading post…</div>
      ) : (
        <form className="space-y-8">
          <div className="grid gap-6 rounded-3xl border border-muted bg-white p-6 shadow-sm md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
              Title
              <input
                type="text"
                value={formState.title}
                onChange={handleTitleChange}
                placeholder="Enter post title"
                className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
              Slug
              <input
                type="text"
                value={formState.slug}
                onChange={handleSlugChange}
                placeholder="auto-generated-from-title"
                className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
              Excerpt
              <textarea
                value={formState.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
                placeholder="Write a captivating summary (min 30 characters)"
                rows={4}
                className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
              Tags
              <input
                type="text"
                value={formState.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="faith, worship, prayer"
                className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <span className="text-xs font-normal text-muted-foreground">Separate tags with commas.</span>
            </label>
            <div className="flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
              Cover image
              {formState.coverImageUrl ? (
                <img
                  src={formState.coverImageUrl}
                  alt={formState.title || "Cover image"}
                  className="h-40 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-muted text-xs text-muted-foreground">
                  No image selected
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleCoverUpload} />
              {uploading && <span className="text-xs text-muted-foreground">Uploading image…</span>}
            </div>
            <div className="flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
              Status
              <select
                value={formState.status}
                onChange={(event) => updateField("status", event.target.value as PostStatus)}
                className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <input
                  type="checkbox"
                  checked={formState.featured}
                  onChange={(event) => updateField("featured", event.target.checked)}
                />
                Feature on homepage
              </label>
            </div>
          </div>

          <div className="rounded-3xl border border-muted bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Content</h3>
              <span className="text-xs text-muted-foreground">Use the toolbar to format your devotional.</span>
            </div>
            <RichTextEditor
              value={formState.content}
              onChange={(value) => updateField("content", value)}
              placeholder="Write your devotional content here..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-muted bg-white p-6 shadow-sm">
            <p className="text-sm text-muted-foreground">Remember to save your progress frequently.</p>
            <div className="ml-auto flex flex-wrap gap-2">
              <Link
                to="/admin/posts"
                className="rounded-full border border-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave("published")}
                disabled={saving}
                className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
              >
                {formState.status === "published" ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
