type ContentType = 'posts' | 'products' | 'media';

interface ContentItem {
  id: string;
  type: ContentType;
  data: any;
  created_at: string;
}

interface FoundySDKOptions {
  jwtToken: string;
  baseUrl?: string; // default: '/api/v2/public/content'
}

class FoundySDKClass {
  private jwtToken: string | null = null;
  private baseUrl: string = '/api/v2/public/';
  private cache: Map<string, ContentItem[]> = new Map();

  /** Set SDK configuration before use */
  configure(options: FoundySDKOptions) {
    this.jwtToken = options.jwtToken;
    if (options.baseUrl) this.baseUrl = options.baseUrl;
  }

  /** Fetch content from API or cache */
  async content(type: ContentType, name?: string): Promise<ContentItem[] | ContentItem | null> {
    if (!this.jwtToken) throw new Error('Foundy SDK is not configured. Call foundy.configure({...}) first.');

    const cacheKey = `${type}:${name || ''}`;
    if (this.cache.has(cacheKey)) {
      const cadched = this.cache.get(cacheKey)!;
      return name ? cached.find(c => c.data.title === name) || null : cached;
    }

    const url = new URL(this.baseUrl, window.location.origin);
    // url.searchParams.set('type', type);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.jwtToken}`
      }
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error || 'Failed to fetch content');
    }

    const json = await res.json();
    const items: ContentItem[] = json.data || [];

    // Cache globally
    this.cache.set(`${type}:`, items);
    if (name) this.cache.set(cacheKey, items.filter(c => c.data.title === name));

    return name ? items.find(c => c.data.title === name) || null : items;
  }
}

/** Singleton instance */
export const foundy = new FoundySDKClass();
