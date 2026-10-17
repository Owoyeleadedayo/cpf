import { useEffect, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { getSupabaseClient } from "../../lib/supabaseClient";
import type { MeditationStatus, WeeklyMeditation } from "../../types/meditation";

interface FormState {
  title: string;
  greeting: string;
  scripture_reference: string;
  scripture_text: string;
  declaration: string;
  week_date: string;
  status: MeditationStatus;
  is_active: boolean;
}

const defaultState: FormState = {
  title: "Daily Prayer & Meditation",
  greeting: "Good morning Covenant People of God 😊.",
  scripture_reference: "",
  scripture_text: "",
  declaration: "",
  week_date: "",
  status: "published",
  is_active: true,
};

export default function AdminMeditationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mode: "create" | "edit" = id ? "edit" : "create";

  const [formState, setFormState] = useState<FormState>(defaultState);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const initialStateRef = useRef<FormState | null>(null);

  // Unsaved-changes guard (mirrors AdminPostForm)
  const isDirty =
    initialStateRef.current !== null &&
    JSON.stringify(formState) !== JSON.stringify(initialStateRef.current);

  const blocker = useBlocker(isDirty);
  useEffect(() => {
    if (blocker.state === "blocked") {
      const leave = window.confirm("You have unsaved changes. Leave this page?");
      if (leave) blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Load existing record when editing
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
          .from("weekly_meditations")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        if (!mounted) return;

        const state: FormState = {
          title: data.title ?? "",
          greeting: data.greeting ?? "",
          scripture_reference: data.scripture_reference ?? "",
          scripture_text: data.scripture_text ?? "",
          declaration: data.declaration ?? "",
          week_date: data.week_date ?? "",
          status: data.status ?? "published",
          is_active: Boolean(data.is_active),
        };
        initialStateRef.current = state;
        setFormState(state);
      } catch (error) {
        console.error("Failed to load meditation", error);
        toast.error("Unable to load meditation");
        navigate("/admin/meditations");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, mode, navigate]);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (targetStatus: MeditationStatus) => {
    if (!formState.scripture_reference.trim()) {
      toast.error("Scripture reference is required.");
      return;
    }
    if (!formState.scripture_text.trim()) {
      toast.error("Scripture text is required.");
      return;
    }
    if (!formState.declaration.trim()) {
      toast.error("The weekly declaration is required.");
      return;
    }

    setSaving(true);
    try {
      const supabase = await getSupabaseClient();

      // If this entry is being set active, clear others first
      if (formState.is_active) {
        await supabase
          .from("weekly_meditations")
          .update({ is_active: false })
          .neq("id", id ?? "");
      }

      const payload = {
        title: formState.title.trim(),
        greeting: formState.greeting.trim(),
        scripture_reference: formState.scripture_reference.trim(),
        scripture_text: formState.scripture_text.trim(),
        declaration: formState.declaration.trim(),
        week_date: formState.week_date.trim(),
        status: targetStatus,
        is_active: formState.is_active,
      };

      if (mode === "create") {
        const { data, error } = await supabase
          .from("weekly_meditations")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        toast.success(targetStatus === "published" ? "Meditation published" : "Draft saved");
        initialStateRef.current = formState;
        navigate(`/admin/meditations/${(data as WeeklyMeditation).id}`, { replace: true });
      } else {
        const { error } = await supabase
          .from("weekly_meditations")
          .update(payload)
          .eq("id", id!);
        if (error) throw error;
        toast.success(targetStatus === "published" ? "Meditation updated & published" : "Draft updated");
        initialStateRef.current = { ...formState, status: targetStatus };
        setFormState((prev) => ({ ...prev, status: targetStatus }));
      }
    } catch (error) {
      console.error("Failed to save meditation", error);
      toast.error("Unable to save meditation");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-muted bg-white p-10 text-center text-muted-foreground">
        Loading meditation…
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {mode === "edit" ? "Edit Meditation" : "New Prayer & Meditation"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Craft the daily prayer or meditation message displayed on the homepage.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={saving}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {formState.status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </header>

      <form className="space-y-8">
        <div className="grid gap-6 rounded-3xl border border-muted bg-white p-6 shadow-sm md:grid-cols-2">
          {/* Title */}
          <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
            Title
            <input
              type="text"
              value={formState.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Daily Prayer & Meditation"
              className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>

          {/* Week / date label */}
          <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
            Week or Date Label
            <input
              type="text"
              value={formState.week_date}
              onChange={(e) => updateField("week_date", e.target.value)}
              placeholder="e.g. Week of October 13, 2026"
              className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>

          {/* Greeting */}
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
            Greeting
            <input
              type="text"
              value={formState.greeting}
              onChange={(e) => updateField("greeting", e.target.value)}
              placeholder="Good morning Covenant People of God 😊."
              className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>

          {/* Scripture reference */}
          <label className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
            Scripture Reference *
            <input
              type="text"
              value={formState.scripture_reference}
              onChange={(e) => updateField("scripture_reference", e.target.value)}
              placeholder="e.g. Psalm 115:9–15"
              className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>

          {/* Status */}
          <div className="flex flex-col gap-3 text-sm font-semibold text-muted-foreground">
            Status
            <select
              value={formState.status}
              onChange={(e) => updateField("status", e.target.value as MeditationStatus)}
              className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <input
                type="checkbox"
                checked={formState.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
              />
              Show on homepage (active)
            </label>
          </div>

          {/* Scripture text */}
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
            Scripture Text *
            <textarea
              value={formState.scripture_text}
              onChange={(e) => updateField("scripture_text", e.target.value)}
              placeholder="Paste or type the Bible verses here…"
              rows={6}
              className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>

          {/* Declaration */}
          <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
            Weekly Declaration / Prayer Message *
            <textarea
              value={formState.declaration}
              onChange={(e) => updateField("declaration", e.target.value)}
              placeholder="This week, trust and take refuge in the Lord God…"
              rows={4}
              className="rounded-lg border border-muted px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
        </div>

        {/* Bottom action bar */}
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-muted bg-white p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Only one meditation can be active on the homepage at a time.
          </p>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link
              to="/admin/meditations"
              className="rounded-full border border-muted px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving…" : formState.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
