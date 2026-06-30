// Server-only Supabase client using the SERVICE ROLE key.
// It bypasses Row-Level Security — use ONLY in server code (route handlers),
// never in a client component. Requires env SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
