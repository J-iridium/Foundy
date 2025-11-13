// Client-side SDK for your /api/v2/app endpoints using cookie-based JWT auth.
export class CMSClient {
	private base: string;
	private version : number;
	constructor(version = 2,base = `/api/v${version}/app`) {
		this.version = version;
		this.base = base;
	}

	// -----------------------------------------------------------------------
	//  AUTH SECTION
	// -----------------------------------------------------------------------
	Auth = {
		login: async (email: string, password: string) => {
			const res = await fetch(`${this.base}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			});
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
		},

		delete: async (site_id: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { error: data.error };
			return { error: null };
		},
		get: async (site_id: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},

		update: async (site_id: string, updates: any) => {
			const res = await fetch(`${this.base}/sites/${site_id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates),
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},

		// -------------------------------------------------------------------
		//  SITE ANALYTICS (single-site level)
		// -------------------------------------------------------------------
		analytics: async (site_id: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}/analytics`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		}
	};

	// -----------------------------------------------------------------------
	//  TOKENS SECTION
	// -----------------------------------------------------------------------
	Tokens = {
		get: async (site_id: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}/token`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},

		rotate: async (site_id: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}/token/rotate`, {
				method: 'POST',
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

		listByType: async (site_id: string, type: string) => {
			const res = await fetch(
				`${this.base}/sites/${site_id}/content?type=${encodeURIComponent(type)}`,
				{ credentials: 'include' }
			);
			const data = await res.json();
			if (!res.ok) return { data: [], error: data.error };
			return { data: data.data, error: null };
		},

		get: async (site_id: string, name: string) => {
			const res = await fetch(
				`${this.base}/sites/${site_id}/content/${encodeURIComponent(name)}`,
				{ credentials: 'include' }
			);
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

		update: async (site_id: string, content_id: string, updates: any) => {
			const res = await fetch(
				`${this.base}/sites/${site_id}/content?name=${encodeURIComponent(content_id)}`,
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updates),
					credentials: 'include'
				}
			);
		
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},
		

		remove: async (site_id: string, content_id: string) => {
			const res = await fetch(`${this.base}/sites/${site_id}/content`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content_id }),
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { success: false, error: data.error };
			return { success: true, error: null };
		}
		
	};

	// -----------------------------------------------------------------------
	//  COMPANY SECTION
	// -----------------------------------------------------------------------
	Company = {
		get: async () => {
			const res = await fetch(`${this.base}/companies/id`, {
				credentials: 'include'
			});
			const data = await res.json();
			if (!res.ok) return { data: null, error: data.error };
			return { data: data.data, error: null };
		},

		update: async (payload) => {
			try {
				const res = await fetch(`${this.base}/companies/id`, {
					method: 'PATCH',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
	
				const data = await res.json();
				if (!res.ok) return { data: null, error: data.error || 'Update failed' };
				return { data: data.data, error: null };
			} catch (err) {
				return { data: null, error: err.message };
			}
		},

		// -------------------------------------------------------------------
		//  COMPANY ANALYTICS (aggregates all site analytics)
		// -------------------------------------------------------------------
		analytics: async () => {
			const { data: sites, error } = await CMS.Sites.list();
			if (error) return { data: null, error };

			const analyticsResults = [];
			for (const site of sites) {
				const { data: siteAnalytics, error: siteError } = await CMS.Sites.analytics(site.id);
				if (siteError) continue;
				analyticsResults.push({
					site_id: site.id,
					domain: site.domain,
					...siteAnalytics
				});
			}

			return { data: analyticsResults, error: null };
		}
	};
}

// ---------------------------------------------------------------------------
//  INSTANCE EXPORT
// ---------------------------------------------------------------------------
export const CMS = new CMSClient();
