// =============================================================================
// Framework/framework/web/WebService.ts
// =============================================================================
// Universal HTTP transport layer.
//
// - Runs on BOTH client and server (no SvelteKit server-only APIs used)
// - Every outbound request in the framework goes through here
// - Never call fetch() directly anywhere else
// - T types the response body — predictable, consistent output every time
//
// Usage:
//   const web = new WebService({ baseUrl: 'https://api.example.com' });
//
//   const res = await web.get<User[]>('/users');
//   const res = await web.post<Order>('/orders', { item: 'x', qty: 2 });
//   const res = await web.upload<Media>('/media/upload', file);
//   const res = await web.stream('/events', chunk => console.log(chunk));
//
//   if (res.ok) {
//     console.log(res.data); // typed as User[] — never unknown
//   } else {
//     console.log(res.error.code); // typed as ApiError — always structured
//   }
// =============================================================================

import type { IService } from "../../server/framework/services/IServices";


// ── Response types ────────────────────────────────────────────────────────────

// Every method returns this — no surprises, no raw fetch responses
export interface ApiResponse<T> {
  ok:     boolean;       // true if HTTP 200-299
  status: number;        // raw HTTP status code
  data:   T | null;      // parsed body cast to T — null if request failed
  error:  ApiError | null; // null if request succeeded
}

// Every error from every service follows this shape
export interface ApiError {
  code:     string;      // machine-readable  e.g. 'AUTH_INVALID_CREDENTIALS'
  message:  string;      // human-readable    e.g. 'Incorrect email or password'
  field?:   string;      // which field failed — for form validation errors
  details?: unknown;     // any extra context the server wants to send
}


// ── Request options ───────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  method?:    HttpMethod;
  headers?:   Record<string, string>; // merged on top of defaults
  token?:     string;                 // bearer token — skips auto-inject if set
  timeout?:   number;                 // ms before request aborts. default: 10_000
  baseUrl?:   string;                 // overrides instance baseUrl for this call
  retry?:     number;                 // retry N times on network failure. default: 0
}


// ── WebService config ─────────────────────────────────────────────────────────

export interface WebServiceConfig {
  baseUrl?:       string;  // e.g. 'https://api.example.com'  or '' for same-origin
  defaultTimeout?: number; // ms. default: 10_000
  getToken?:      () => string | null; // how to read the current bearer token
                           // server-side: read from cookie
                           // client-side: read from cookie / store
}


// ── WebService ────────────────────────────────────────────────────────────────

export class WebService implements IService {
  
  name: string = "Web";
  version: string = "1.0.0";
  tags: string[] = ["core", "web"];
  private config: Required<WebServiceConfig>;

  constructor(config: WebServiceConfig = {}) {
    this.config = {
      baseUrl:        config.baseUrl        ?? '',
      defaultTimeout: config.defaultTimeout ?? 10_000,
      getToken:       config.getToken       ?? (() => null),
    };
  }
  init(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  healthCheck(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  // Generic escape hatch — use when none of the verbs below fit
  visit<T = unknown>(
    url: string,
    options: RequestOptions & { body?: unknown } = {}
  ): Promise<ApiResponse<T>> {
    return this.execute<T>(url, options);
  }

  // GET — no body
  get<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.execute<T>(url, { ...options, method: 'GET' });
  }

  // POST — with body
  post<T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.execute<T>(url, { ...options, method: 'POST', body });
  }

  // PUT — full replace
  put<T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.execute<T>(url, { ...options, method: 'PUT', body });
  }

  // PATCH — partial update
  patch<T = unknown>(
    url: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.execute<T>(url, { ...options, method: 'PATCH', body });
  }

  // DELETE — no body
  delete<T = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.execute<T>(url, { ...options, method: 'DELETE' });
  }

  // UPLOAD — multipart/form-data
  // Pass a File, Blob, or pre-built FormData
  // Never set Content-Type manually — fetch sets the boundary automatically
  upload<T = unknown>(
    url: string,
    file: File | Blob | FormData,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const form = file instanceof FormData ? file : (() => {
      const fd = new FormData();
      fd.append('file', file);
      return fd;
    })();

    // Pass body as FormData — execute() detects this and skips JSON serialisation
    return this.execute<T>(url, { ...options, method: 'POST', body: form });
  }

  // STREAM — Server-Sent Events / chunked responses
  // onChunk is called for every text chunk received
  // Useful for real-time features, AI completions, progress updates
  async stream(
    url: string,
    onChunk: (chunk: string) => void,
    options: RequestOptions = {}
  ): Promise<void> {
    const fullUrl = this.resolveUrl(url, options.baseUrl);
    const headers = this.buildHeaders(options, false); // no Content-Type for streams

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      options.timeout ?? this.config.defaultTimeout
    );

    try {
      const response = await fetch(fullUrl, {
        method:  options.method ?? 'GET',
        headers,
        signal:  controller.signal,
      });

      if (!response.body) return;

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(decoder.decode(value, { stream: true }));
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  // ── Core execution ─────────────────────────────────────────────────────────

  private async execute<T>(
    url: string,
    options: RequestOptions & { body?: unknown } = {},
    attempt = 0
  ): Promise<ApiResponse<T>> {

    const fullUrl    = this.resolveUrl(url, options.baseUrl);
    const isFormData = options.body instanceof FormData;
    const headers    = this.buildHeaders(options, !isFormData && options.body !== undefined);
    const body       = this.serializeBody(options.body);

    const controller = new AbortController();
    const timeout    = setTimeout(
      () => controller.abort(),
      options.timeout ?? this.config.defaultTimeout
    );

    try {
      const response = await fetch(fullUrl, {
        method:  options.method ?? 'GET',
        headers,
        body,
        signal:  controller.signal,
      });

      clearTimeout(timeout);
      return await this.parseResponse<T>(response);

    } catch (err) {

      clearTimeout(timeout);

      // Retry on network failure (not on HTTP errors)
      const maxRetries = options.retry ?? 0;
      if (attempt < maxRetries) {
        return this.execute<T>(url, options, attempt + 1);
      }

      // AbortError = timeout
      if ((err as Error).name === 'AbortError') {
        return this.failure<T>(408, {
          code:    'TIMEOUT',
          message: 'The request took too long. Please try again.',
        });
      }

      // Any other fetch error = no network
      return this.failure<T>(0, {
        code:    'NETWORK_ERROR',
        message: 'No internet connection.',
      });
    }
  }

  // ── Response parsing ───────────────────────────────────────────────────────
  //
  // 200-299  → ok: true,  data: T,    error: null
  // 400-599  → ok: false, data: null, error: ApiError
  // non-JSON → ok: false, data: null, error: PARSE_ERROR
  //
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {

    // Try to parse JSON — even error responses should be JSON
    let body: unknown = null;

    try {
      const text = await response.text();
      body = text ? JSON.parse(text) : null;
    } catch {
      // Response body was not JSON
      if (!response.ok) {
        return this.failure<T>(response.status, {
          code:    'PARSE_ERROR',
          message: 'The server returned an unexpected response format.',
        });
      }
      // 2xx but non-JSON (e.g. 204 No Content) — treat data as null
      return { ok: true, status: response.status, data: null, error: null };
    }

    // Success
    if (response.ok) {
      return {
        ok:     true,
        status: response.status,
        data:   body as T,   // cast — T is the caller's contract with the API
        error:  null,
      };
    }

    // Error — expect { code, message, field?, details? }
    const error = this.extractError(body, response.status);
    return this.failure<T>(response.status, error);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private buildHeaders(
    options: RequestOptions,
    includeContentType: boolean
  ): Record<string, string> {

    const token = options.token ?? this.config.getToken();

    const defaults: Record<string, string> = {
      'Accept':          'application/json',
      'X-App-Version':   this.version,
    };

    if (includeContentType) {
      defaults['Content-Type'] = 'application/json';
    }

    if (token) {
      defaults['Authorization'] = `Bearer ${token}`;
    }

    // Caller headers override defaults
    return { ...defaults, ...(options.headers ?? {}) };
  }

  private serializeBody(body: unknown): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;
    if (body instanceof FormData)           return body;   // pass through
    return JSON.stringify(body);
  }

  private resolveUrl(path: string, baseUrlOverride?: string): string {
    const base = baseUrlOverride ?? this.config.baseUrl;
    if (!base || path.startsWith('http')) return path; // already absolute
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  private extractError(body: unknown, status: number): ApiError {
    if (
      body &&
      typeof body === 'object' &&
      'code'    in body &&
      'message' in body
    ) {
      return body as ApiError;
    }

    // Server returned an error but not in the expected shape
    return {
      code:    `HTTP_${status}`,
      message: 'An unexpected error occurred.',
      details: body,
    };
  }

  private failure<T>(status: number, error: ApiError): ApiResponse<T> {
    return { ok: false, status, data: null, error };
  }
}