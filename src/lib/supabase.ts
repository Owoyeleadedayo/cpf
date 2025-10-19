// Unified Supabase client entrypoint.
// The project uses an async loader `getSupabaseClient()` in `supabaseClient.ts` so
// re-export that here to avoid multiple different client implementations.
// Prefer importing `getSupabaseClient` for code that needs the client (async):
//   const supabase = await getSupabaseClient();

export { getSupabaseClient, type SupabaseClient } from './supabaseClient';

// Keep a default export for compatibility — re-export the async loader as default.
export { getSupabaseClient as default } from './supabaseClient';
