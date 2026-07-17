-- Snapshot the agent's display name onto route_sessions so the admin sales
-- read path no longer needs auth.admin.listUsers(). Mirrors the existing
-- snapshot_product_name / snapshot_price denormalization on sales.
--
-- The agent-app writes conducted_by_name at session creation (offline-first).
-- This trigger only fills the column when the app left it NULL (old app
-- versions, or server-originated rows), sourcing from auth.users. An
-- app-provided value is authoritative and never overwritten.

ALTER TABLE public.route_sessions
  ADD COLUMN IF NOT EXISTS conducted_by_name text;

CREATE OR REPLACE FUNCTION public.fill_route_session_conducted_by_name()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.conducted_by_name IS NULL THEN
    SELECT u.raw_user_meta_data->>'name'
      INTO NEW.conducted_by_name
      FROM auth.users u
     WHERE u.id = NEW.conducted_by;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS fill_conducted_by_name ON public.route_sessions;

CREATE TRIGGER fill_conducted_by_name
  BEFORE INSERT OR UPDATE ON public.route_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.fill_route_session_conducted_by_name();
