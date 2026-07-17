// backfill-conducted-by-name.js — one-time backfill of route_sessions.conducted_by_name
// Run: SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node backfill-conducted-by-name.js
// Idempotent: only touches rows where conducted_by_name IS NULL.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const REST_URL = `${URL}/rest/v1`;
const authHeaders = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
};

async function listAllUsers() {
  // GoTrue admin listUsers is paginated (default 50/page).
  const users = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `${URL}/auth/v1/admin/users?page=${page}&per_page=1000`,
      { headers: authHeaders },
    );
    if (!res.ok) throw new Error(`listUsers failed: ${await res.text()}`);
    const body = await res.json();
    users.push(...body.users);
    if (body.users.length < 1000) break;
    page += 1;
  }
  return users;
}

async function main() {
  // 1. uuid -> name map (same precedence as admin getAgentMap)
  const users = await listAllUsers();
  const nameById = {};
  for (const u of users) {
    nameById[u.id] = u.user_metadata?.name || u.email || "Unknown";
  }

  // 2. rows still missing a name
  const selRes = await fetch(
    `${REST_URL}/route_sessions?select=id,conducted_by&conducted_by_name=is.null`,
    { headers: authHeaders },
  );
  if (!selRes.ok) throw new Error(`select failed: ${await selRes.text()}`);
  const rows = await selRes.json();
  console.log(`${rows.length} rows to backfill`);

  // 3. update each (grouped by uuid to minimize calls)
  const byUuid = {};
  for (const r of rows) (byUuid[r.conducted_by] ??= []).push(r.id);

  let done = 0;
  for (const [uuid, ids] of Object.entries(byUuid)) {
    const name = nameById[uuid] ?? "Unknown";
    const idList = ids.map((id) => `"${id}"`).join(",");
    const updRes = await fetch(
      `${REST_URL}/route_sessions?id=in.(${idList})&conducted_by_name=is.null`,
      {
        method: "PATCH",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ conducted_by_name: name }),
      },
    );
    if (!updRes.ok) throw new Error(`update failed: ${await updRes.text()}`);
    done += ids.length;
    process.stdout.write(`  ${done}/${rows.length}\r`);
  }
  console.log(`\nBackfill complete: ${done} rows.`);
}

main().catch((e) => {
  console.error("\nFATAL:", e.message);
  process.exit(1);
});
