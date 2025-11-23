import FingerprintJS from '@fingerprintjs/fingerprintjs';

type ContentType = 'posts' | 'products' | 'media';

interface ContentItem {
  id: string;
  type: ContentType;
  data: any;
  created_at: string;
}

interface FoundySDKOptions {
  jwtToken: string;
  baseUrl?: string;
}

class FoundySDKClass {
  private dev : boolean = true;
  private jwtToken: string | null = null;
  private baseUrl : string = 'https://www.foundy.com/'
  private apiUri : string = '/api/v2/public/';
  private analyticsUriExtension: string = 'analytics/'
  private cache: Map<string, ContentItem[]> = new Map();
  private fingerprint: string | null = null;
  // private fpPromise = import('https://openfpcdn.io/fingerprintjs/v5').then(FingerprintJS => FingerprintJS.load())

  /** Set SDK configuration before use */
  async configure(options: FoundySDKOptions) {
    this.jwtToken = options.jwtToken;
    if (options.baseUrl) this.baseUrl = options.baseUrl;
    
    if (this.dev) {
      this.baseUrl = 'http//localhost:5173/'
    }
   
    await this.generateFingerprint();
  }

  /** Generate fingerprint for this device */
  async generateFingerprint() {
    if (this.fingerprint) return this.fingerprint;

    const fp = await FingerprintJS.load();
    const result = await fp.get();
    console.log(result)
    this.fingerprint = result.visitorId; // unique device ID
    return this.fingerprint;
  }

  /** Fetch content from API or cache */
  async content(type: ContentType, name?: string): Promise<ContentItem[] | ContentItem | null> {
    if (!this.jwtToken) throw new Error('Foundy SDK is not configured. Call foundy.configure({...}) first.');

    // Ensure fingerprint is generated (optional, you can send it to API)
    const deviceId = await this.generateFingerprint();

    const cacheKey = `${type}:${name || ''}`;
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return name ? cached.find(c => c.data.title === name) || null : cached;
    }

    const url = new URL(this.apiUri,this.baseUrl);
    console.log(url)
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.jwtToken}`,
        'X-Device-ID': deviceId // send fingerprint to API
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
