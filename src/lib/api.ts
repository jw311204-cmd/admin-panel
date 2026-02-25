const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://everest-backend-qquj.onrender.com';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('admin_token');
}

export function setToken(token: string) {
  localStorage.setItem('admin_token', token);
}

export function clearToken() {
  localStorage.removeItem('admin_token');
}

async function fetchApi(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  login: (email: string, password: string) =>
    fetch(`${API_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (r) => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Login failed');
      return d;
    }),

  getDashboard: () => fetchApi('/api/admin/dashboard'),
  getInfluencers: () => fetchApi('/api/admin/influencers'),
  createInfluencer: (body: { name: string; email?: string; commissionPercentage?: number }) =>
    fetchApi('/api/admin/influencers', { method: 'POST', body: JSON.stringify(body) }),
  patchInfluencer: (id: number, body: { commissionPercentage?: number; isDisabled?: boolean }) =>
    fetchApi(`/api/admin/influencers/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getPromoCodes: () => fetchApi('/api/admin/promo-codes'),
  createPromoCode: (body: { code: string; influencer_id: number }) =>
    fetchApi('/api/admin/promo-codes', { method: 'POST', body: JSON.stringify(body) }),
  getRevenueSummary: () => fetchApi('/api/admin/revenue-summary'),
  getPromoAssignments: () => fetchApi('/api/admin/promo-assignments'),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    fetchApi('/api/admin/auth/change-password', { method: 'PATCH', body: JSON.stringify(body) }),
};
