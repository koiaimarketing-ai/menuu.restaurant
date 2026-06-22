/**
 * Minimal Supabase access over the PostgREST REST API — no npm dependency.
 * All calls are gated by env; when Supabase isn't configured the helpers report
 * `configured: false` so endpoints can degrade gracefully instead of crashing.
 *
 * Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only) to
 * enable. The service-role key must NEVER be exposed to the browser.
 */
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = (): boolean => Boolean(URL_ && SERVICE_KEY);

function headers() {
  return {
    apikey: SERVICE_KEY as string,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export async function sbInsert<T = unknown>(table: string, row: Record<string, unknown>): Promise<T | null> {
  if (!supabaseConfigured()) return null;
  const res = await fetch(`${URL_}/rest/v1/${table}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
  const data = (await res.json()) as T[];
  return Array.isArray(data) ? data[0] ?? null : (data as T);
}

export async function sbUpdate(
  table: string,
  match: Record<string, string>,
  patch: Record<string, unknown>
): Promise<boolean> {
  if (!supabaseConfigured()) return false;
  const qs = new URLSearchParams();
  Object.entries(match).forEach(([k, v]) => qs.set(k, `eq.${v}`));
  const res = await fetch(`${URL_}/rest/v1/${table}?${qs.toString()}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(patch),
    cache: "no-store",
  });
  return res.ok;
}
