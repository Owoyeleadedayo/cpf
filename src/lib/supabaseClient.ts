const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let clientPromise: Promise<any> | null = null;

async function loadSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase credentials are missing. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
    );
  }

  if (!clientPromise) {
    clientPromise = import(
      "https://esm.sh/@supabase/supabase-js@2.48.0?bundle"
    ).then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  }

  return clientPromise;
}

export async function getSupabaseClient() {
  return loadSupabaseClient();
}

export type SupabaseClient = Awaited<ReturnType<typeof loadSupabaseClient>>;
