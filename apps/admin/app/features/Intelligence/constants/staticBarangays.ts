export type GeoRevenueRow = { barangay: string; province: string; revenue: number };

export const STATIC_BARANGAYS: GeoRevenueRow[] = [
  { barangay: "Makati", province: "Metro Manila", revenue: 15000 },
  { barangay: "Quezon City", province: "Metro Manila", revenue: 18000 },
  { barangay: "Caloocan", province: "Metro Manila", revenue: 12000 },
  { barangay: "San Juan", province: "Bulacan", revenue: 10000 },
  { barangay: "Meycauayan", province: "Bulacan", revenue: 9000 },
  { barangay: "Biñan", province: "Laguna", revenue: 11000 },
  { barangay: "Santa Rosa", province: "Laguna", revenue: 12000 },
  { barangay: "Dasmariñas", province: "Cavite", revenue: 8000 },
];
