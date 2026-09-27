import { createClient } from "npm:@supabase/supabase-js@2";
Deno.serve(async (req) => {
  if (req.headers.get("x-import-token") !== "a199fae01346b034e05a6afe693a03c5") return new Response("no", { status: 403 });
  const rows = await req.json();
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await sb.from("content_translations").upsert(rows, { onConflict: "entity_type,entity_id,lang,field_name" });
  return new Response(JSON.stringify({ ok: !error, error, n: rows.length }));
});
