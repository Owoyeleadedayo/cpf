import { useEffect, useState } from "react";
import { getSupabaseClient } from "../../lib/supabaseClient";

interface Stats {
  total: number;
  published: number;
  drafts: number;
  featured: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const supabase = await getSupabaseClient();
        const [{ count: total }, { count: published }, { count: drafts }, { count: featured }] = await Promise.all([
          supabase.from("posts").select("id", { count: "exact", head: true }),
          supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .eq("status", "published"),
          supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .eq("status", "draft"),
          supabase
            .from("posts")
            .select("id", { count: "exact", head: true })
            .eq("featured", true)
            .eq("status", "published"),
        ]);

        if (mounted) {
          setStats({
            total: total ?? 0,
            published: published ?? 0,
            drafts: drafts ?? 0,
            featured: featured ?? 0,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Review the state of your devotional posts at a glance.
        </p>
      </header>

      {loading && (
        <div className="rounded-3xl border border-muted bg-white p-10 text-center text-muted-foreground">
          Loading metrics…
        </div>
      )}

      {stats && (
        <dl className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total posts" value={stats.total} description="All devotionals including drafts" />
          <StatCard title="Published" value={stats.published} description="Visible to visitors" />
          <StatCard title="Drafts" value={stats.drafts} description="Still a work in progress" />
          <StatCard title="Featured" value={stats.featured} description="Appearing on the homepage carousel" />
        </dl>
      )}
    </section>
  );
}

function StatCard({ title, value, description }: { title: string; value: number; description: string }) {
  return (
    <div className="rounded-3xl border border-muted bg-white p-6 shadow-sm">
      <dt className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</dt>
      <dd className="mt-3 text-4xl font-bold text-foreground">{value}</dd>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
