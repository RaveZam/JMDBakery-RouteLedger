export type RouteSession = {
  id: string;
  route_name: string;
  session_date: string;
  conducted_by: string;
  status: string;
  created_at: string;
};

export type SessionStore = {
  id: string;
  route_session_id: string;
  store_id: string;
  store_name: string;
  store_province: string | null;
  store_city: string | null;
  store_barangay: string | null;
  store_contact_name: string | null;
  province_name: string | null;
  visited: number;
  created_at: string;
};
