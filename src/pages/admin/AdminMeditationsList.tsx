import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { getSupabaseClient } from "../../lib/supabaseClient";
import type { WeeklyMeditation, MeditationStatus } from "../../types/meditation";

export default function AdminMeditationsList() {
  const [meditations, setMeditations] = useState<WeeklyMeditation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeditations = async () => {
    setLoading(true);
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from("weekly_meditations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMeditations(data ?? []);
    } catch (error) {
      console.error("Failed to load meditations", error);
      toast.error("Unable to load meditations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeditations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this meditation? This action cannot be undone.")) return;
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.from("weekly_meditations").delete().eq("id", id);
      if (error) throw error;
      toast.success("Meditation deleted");
      setMeditations((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Failed to delete meditation", error);
      toast.error("Unable to delete meditation");
    }
  };

  const handleToggleStatus = async (item: WeeklyMeditation) => {
    const next: MeditationStatus = item.status === "published" ? "draft" : "published";
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from("weekly_meditations")
        .update({ status: next })
        .eq("id", item.id);
      if (error) throw error;
      toast.success(next === "published" ? "Published" : "Moved to draft");
      setMeditations((prev) =>
        prev.map((m) => (m.id === item.id ? { ...m, status: next } : m))
      );
    } catch (error) {
      console.error("Failed to toggle status", error);
      toast.error("Unable to update status");
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const supabase = await getSupabaseClient();
      // Remove active flag from all, then set on the chosen one
      await supabase.from("weekly_meditations").update({ is_active: false }).neq("id", id);
      const { error } = await supabase
        .from("weekly_meditations")
        .update({ is_active: true, status: "published" })
        .eq("id", id);
      if (error) throw error;
      toast.success("Set as active meditation");
      setMeditations((prev) =>
        prev.map((m) => ({
          ...m,
          is_active: m.id === id,
          status: m.id === id ? "published" : m.status,
        }))
      );
    } catch (error) {
      console.error("Failed to set active", error);
      toast.error("Unable to set active meditation");
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Prayer &amp; Meditations</h2>
          <p className="text-sm text-muted-foreground">
            Manage the daily prayer and meditation messages shown on the homepage.
          </p>
        </div>
        <Link
          to="/admin/meditations/new"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          + New Meditation
        </Link>
      </header>

      <div className="grid gap-6">
        {loading && (
          <div className="rounded-3xl border border-muted bg-white p-10 text-center text-muted-foreground">
            Loading meditations…
          </div>
        )}

        {!loading && meditations.length === 0 && (
          <div className="rounded-3xl border border-muted bg-white p-10 text-center text-muted-foreground">
            No meditations yet. Click &ldquo;+ New Meditation&rdquo; to create the first one.
          </div>
        )}

        {meditations.map((item) => (
          <article key={item.id} className="rounded-3xl border border-muted bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                  <span
                    className={`rounded-full px-2 py-1 ${
                      item.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.is_active && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                      ★ Active
                    </span>
                  )}
                  {item.week_date && (
                    <span className="text-muted-foreground">{item.week_date}</span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>

                {item.greeting && (
                  <p className="text-sm font-medium text-muted-foreground">{item.greeting}</p>
                )}

                <p className="text-sm font-semibold text-primary">{item.scripture_reference}</p>

                <p className="text-sm text-muted-foreground line-clamp-2 italic">
                  &ldquo;{item.scripture_text}&rdquo;
                </p>

                <p className="text-sm text-foreground line-clamp-2">{item.declaration}</p>

                <p className="text-xs text-muted-foreground">
                  Updated {new Date(item.updated_at).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end shrink-0">
                {!item.is_active && (
                  <button
                    type="button"
                    onClick={() => handleSetActive(item.id)}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Set Active
                  </button>
                )}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/admin/meditations/${item.id}`}
                    className="rounded-full border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item)}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {item.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-full border border-destructive px-4 py-2 text-xs font-semibold uppercase tracking-wide text-destructive transition hover:bg-destructive hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive"
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
