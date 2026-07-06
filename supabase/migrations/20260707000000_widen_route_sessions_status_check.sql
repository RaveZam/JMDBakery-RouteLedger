-- Widen route_sessions.status to allow 'cancelled'.
--
-- The agent-app now cancels an ongoing session (setting status = 'cancelled')
-- to enforce a single ongoing session at a time. cancelSession enqueues an
-- outbox upsert that pushes the cancelled row to this table. If the remote
-- CHECK still only permits ('ongoing', 'completed'), every cancel row errors
-- on upsert and retries in the outbox forever. This migration brings the
-- remote constraint in line with the local SQLite schema (routeledger-v4).
--
-- Idempotent: safe to re-run. The DROP ... IF EXISTS uses Postgres's default
-- inline-CHECK constraint name (<table>_<column>_check). If your project named
-- the constraint differently, the DROP is a no-op and the ADD below will fail
-- because a conflicting constraint remains — in that case find the real name
-- with:
--   SELECT conname FROM pg_constraint
--   WHERE conrelid = 'public.route_sessions'::regclass AND contype = 'c';
-- and drop that name instead.

ALTER TABLE public.route_sessions
  DROP CONSTRAINT IF EXISTS route_sessions_status_check;

ALTER TABLE public.route_sessions
  ADD CONSTRAINT route_sessions_status_check
  CHECK (status IN ('ongoing', 'completed', 'cancelled'));
