import { NavLink, Outlet } from "react-router";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useSupabaseAuth } from "../../context/SupabaseAuthContext";

export default function AdminLayout() {
  const { supabase, session } = useSupabaseAuth();

  const handleSignOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out.");
    } else {
      toast.success("Signed out successfully.");
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-muted bg-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin Dashboard</p>
            <h1 className="text-xl font-bold text-foreground">Devotional Management</h1>
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.email && (
              <span className="hidden text-sm text-muted-foreground md:inline">{session.user.email}</span>
            )}
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary transition hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="border-t border-muted bg-white">
          <div className="container mx-auto flex flex-wrap items-center gap-4 px-4 py-3">
            <AdminNavLink to="/admin">Overview</AdminNavLink>
            <AdminNavLink to="/admin/posts">Posts</AdminNavLink>
            <AdminNavLink to="/admin/posts/new">Create Post</AdminNavLink>
            <NavLink
              to="/"
              className="rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              View site
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function AdminNavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        `rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary"
        }`
      }
      end
    >
      {children}
    </NavLink>
  );
}
