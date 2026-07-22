-- Same issue as stores_province_id_fkey: deleting a route cascades to
-- deleting its provinces (agent_provinces), but session_stores_province_id_fkey
-- had no ON DELETE action, blocking the delete whenever a historical
-- session_stores row still referenced that province.
ALTER TABLE public.session_stores
  DROP CONSTRAINT session_stores_province_id_fkey;

ALTER TABLE public.session_stores
  ADD CONSTRAINT session_stores_province_id_fkey
  FOREIGN KEY (province_id) REFERENCES public.agent_provinces(id)
  ON DELETE SET NULL;
