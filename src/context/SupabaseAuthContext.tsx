import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabaseClient, type SupabaseClient } from "../lib/supabaseClient";

interface AuthContextValue {
  supabase: SupabaseClient | null;
  session: any;
  loading: boolean;
}

const SupabaseAuthContext = createContext<AuthContextValue | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;

    getSupabaseClient()
      .then((client) => {
        if (!isMounted) return;
        setSupabaseClient(client);
        client.auth
          .getSession()
          .then(({ data }: { data: { session: unknown } }) => {
            if (!isMounted) return;
            setSession(data.session ?? null);
            setLoading(false);
          })
          .catch(() => {
            if (isMounted) setLoading(false);
          });

        const {
          data: { subscription },
        } = client.auth.onAuthStateChange((_: unknown, newSession: unknown) => {
          setSession(newSession);
        });

        cleanup = () => {
          subscription.unsubscribe();
        };
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  const value = useMemo(
    () => ({
      supabase: supabaseClient,
      session,
      loading,
    }),
    [supabaseClient, session, loading],
  );

  return (
    <SupabaseAuthContext.Provider value={value}>
      {supabaseClient ? children : loading ? null : children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider");
  }
  return context;
}
