const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.tikito.in";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...rest,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (identifier: string, password: string) =>
    apiFetch<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password, role: "admin" }),
    }),

  me: (token: string) =>
    apiFetch<{
      admin_id: string;
      full_name: string;
      email: string;
      phone_no: string | null;
      role: string;
      is_active: boolean;
      created_at: string;
    }>("/auth/me", { token }),
};

// Admin endpoints
export const adminApi = {
  dashboard: (token: string) =>
    apiFetch<{
      total_users: number;
      total_vendors: number;
      total_turfs: number;
      total_grounds: number;
      total_bookings: number;
      confirmed_bookings: number;
      cancelled_bookings: number;
      total_revenue: number;
    }>("/admin/dashboard", { token }),

  // Users
  getUsers: (token: string) => apiFetch<UserRecord[]>("/admin/users", { token }),
  getUser: (token: string, id: string) => apiFetch<UserRecord>(`/admin/users/${id}`, { token }),
  toggleUserStatus: (token: string, id: string, is_active: boolean) =>
    apiFetch(`/admin/users/${id}/status`, {
      method: "PUT",
      token,
      body: JSON.stringify({ is_active }),
    }),
  deleteUser: (token: string, id: string) =>
    apiFetch(`/admin/users/${id}`, { method: "DELETE", token }),

  // Vendors
  getVendors: (token: string) => apiFetch<VendorRecord[]>("/admin/vendors", { token }),
  getVendor: (token: string, id: string) => apiFetch<VendorRecord>(`/admin/vendors/${id}`, { token }),
  verifyVendor: (token: string, id: string) =>
    apiFetch(`/admin/vendors/${id}/verify`, { method: "PUT", token }),
  toggleVendorStatus: (token: string, id: string, is_active: boolean) =>
    apiFetch(`/admin/vendors/${id}/status`, {
      method: "PUT",
      token,
      body: JSON.stringify({ is_active }),
    }),
  deleteVendor: (token: string, id: string) =>
    apiFetch(`/admin/vendors/${id}`, { method: "DELETE", token }),

  // Turfs
  getTurfs: (token: string) => apiFetch<TurfRecord[]>("/admin/turfs", { token }),
  toggleTurfStatus: (token: string, id: string, is_active: boolean) =>
    apiFetch(`/admin/turfs/${id}/status`, {
      method: "PUT",
      token,
      body: JSON.stringify({ is_active }),
    }),
  deleteTurf: (token: string, id: string) =>
    apiFetch(`/admin/turfs/${id}`, { method: "DELETE", token }),

  // Bookings
  getBookings: (token: string) => apiFetch<BookingRecord[]>("/admin/bookings", { token }),
  cancelBooking: (token: string, id: string) =>
    apiFetch(`/admin/bookings/${id}/cancel`, { method: "PUT", token }),
  deleteBooking: (token: string, id: string) =>
    apiFetch(`/admin/bookings/${id}`, { method: "DELETE", token }),
};

// Types
export interface UserRecord {
  user_id: string;
  full_name: string;
  phone_no: string;
  email: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface VendorRecord {
  vendor_id: string;
  vendor_full_name: string;
  vendor_phone_no: string | null;
  vendor_email_id: string | null;
  vendor_address: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface TurfRecord {
  turf_field_id: string;
  turf_name: string;
  turf_location: string | null;
  turf_address: string | null;
  no_of_grounds: number | null;
  is_active: boolean;
  created_at: string;
  vendor_full_name: string;
  vendor_id: string;
}

export interface BookingRecord {
  booking_id: string;
  booking_date: string;
  booking_status: string;
  payment_status: string;
  booked_at: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  start_time: string;
  end_time: string;
  price: number;
  day_of_week: string;
  ground_name: string;
  ground_type: string | null;
  turf_name: string;
  turf_address: string | null;
  user_name: string | null;
  user_phone: string | null;
}
