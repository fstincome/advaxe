import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPECTED = "afix-7f3c9d2e1b48a6c5f0e9d3b7a2c4e8f1";

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (request.headers.get("x-fix-token") !== EXPECTED) return new Response("forbidden", { status: 403 });

  const { updates } = await request.json();
  if (!Array.isArray(updates)) return new Response("bad payload", { status: 400 });

  const client = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  const results: Array<{ entity_id: string; lang: string; field: string; ok: boolean; error: string | null }> = [];
  for (const u of updates) {
    const { error } = await client
      .from("content_translations")
      .update({ value: u.value, updated_at: new Date().toISOString() })
      .eq("entity_type", "article")
      .eq("entity_id", u.entity_id)
      .eq("lang", u.lang)
      .eq("field_name", u.field);
    results.push({ entity_id: u.entity_id, lang: u.lang, field: u.field, ok: !error, error: error?.message ?? null });
  }
  return new Response(JSON.stringify(results), { headers: { "content-type": "application/json" } });
});
