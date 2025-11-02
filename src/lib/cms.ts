// src/lib/cms.ts
// Client-side SDK for your /api/v2/app endpoints using cookie-based JWT auth.

export class CMSClient {
	private base: string;

	constructor(base = '/api/v2/app') {
		this.base = base;
	}

	// -----------------------------------------------------------------------
	//  AUTH SECTION (uses cookie session_token)
	// -----------------------------------------------------------------------
	Auth = {
		login: async (email: string, password: string) => {
			// This will set the session_token cookie on the response
			const res = await fetch(`${this.base}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			});

			// The backend should handle redirect or JSON response
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error || 'Login failed');

			return data;
		},

		logout: async () => {
			await fetch(`${this.base}/auth/logout`, {
				method: 'POST',
				credentials: 'include'
			});
		},

		session: async () => {
			const res = await fetch(`${this.base}/auth/session`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Session fetch failed');
			return data.session;
		}
	};

	// -----------------------------------------------------------------------
	//  SITES SECTION
	// -----------------------------------------------------------------------
	Sites = {
		list: async () => {
			const res = await fetch(`${this.base}/sites`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: [], error: data.error };
			return { data: data.data, error: null };
		},

		create: async (payload: { name: string; domain: string }) => {
			const res = await fetch(`${this.base}/sites`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		}
	};

	// -----------------------------------------------------------------------
	//  CONTENT SECTION
	// -----------------------------------------------------------------------
	Content = {
		list: async (site_id: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}/content`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: [], error: data.error };
			return { data: data.data, error: null };
		},

		get: async (site_id: string, name: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}/content/${encodeURIComponent(name)}`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},

		create: async (payload: {
			site_id: string;
			name: string;
			type: string;
			status: string;
			data: any;
		}) => {
			const res = await fetch(`${this.base}/sites/${payload.site_id}/content`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},

		update: async (site_id: string, name: string, updates: any) => {
			const res = await fetch(`${this.base}/sites/${site_id}/content/${encodeURIComponent(name)}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates),
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},

		remove: async (site_id: string, name: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}/content/${encodeURIComponent(name)}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { success: false, error: data.error };
			return { success: true, error: null };
		}
	};
}

// ---------------------------------------------------------------------------
//  INSTANCE EXPORT
// ---------------------------------------------------------------------------
export const CMS = new CMSClient();
