import { useState } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useSupabaseAuth } from "../../context/SupabaseAuthContext";

export default function AdminLoginPage() {
  const { supabase } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Failed to sign in", error);
      toast.error("Unable to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4 py-12">
      <Helmet>
        <title>Admin Login | Covenant People Fellowship</title>
      </Helmet>
      <div className="w-full max-w-md rounded-3xl border border-muted bg-white p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Admin Portal</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use your admin Supabase credentials to manage devotionals.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <label className="block text-sm font-semibold text-muted-foreground">
            Email
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-muted px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <label className="block text-sm font-semibold text-muted-foreground">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-muted px-4 py-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-xs text-muted-foreground">
          Locked out? Contact the site administrator for access.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
