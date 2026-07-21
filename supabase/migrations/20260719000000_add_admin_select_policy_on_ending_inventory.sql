-- ending_inventory was missing the admin policy that session_inventory and
-- sales both have, so admins couldn't read it. get_session_inventory_summary
-- is `security invoker`, so RLS filtered the ending rows out mid-query and
-- sum(ending) silently collapsed to 0 -- the admin board showed "Ending 0"
-- and a full-negative variance for every session, with no error.
--
-- The pre-existing "Admin full access on ending_inventory" policy never
-- matched: `auth.jwt() ->> 'role'` is the Postgres role ('authenticated'),
-- not the app role. The app role lives in user_metadata, which is what the
-- sibling tables key on.
create policy "admins_full_access"
  on public.ending_inventory
  for all
  to authenticated
  using (((auth.jwt() -> 'user_metadata') ->> 'role') = 'admin');
