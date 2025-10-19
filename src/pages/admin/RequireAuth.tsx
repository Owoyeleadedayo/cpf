import { Navigate, Outlet, useLocation } from "react-router";
import { useSupabaseAuth } from "../../context/SupabaseAuthContext";

export function RequireAuth() {
  const { session, loading } = useSupabaseAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Checking authentication…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
