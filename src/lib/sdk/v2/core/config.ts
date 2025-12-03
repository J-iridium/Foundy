import type { FoundySDKOptions, ContentItem, ContentType, HydrationJob } from "./types";
import { generateFingerprint } from "./fingerprint";
import { fetchContent } from "./fetch";
import { SimpleCache } from "./cache";
import { scanForHydrationJobs } from "../hydration/scanner";
import { scheduleJobs } from "../hydration/scheduler";
import { runHydration } from "../hydration/hydrate";

class FoundySDKClass {
  private dev: boolean = true;
  private jwtToken: string | null = null;
  private baseUrl: string = "https://www.foundy.com/";
  private apiUri: string = "api/v2/public/";
  private cache = new SimpleCache();
  private fingerprint: string | null = null;
  private options: Partial<FoundySDKOptions> = {};

  constructor() {
    // Attach to window so HTML config script can call it before module import
    if (typeof window !== "undefined") {
      // @ts-ignore
      if (!window.foundy) (window as any).foundy = this;
    }
  }

  /** Configure SDK (call early) */
  async configure(opts: FoundySDKOptions) {
    this.options = opts;
    this.jwtToken = opts.jwtToken;
    if (typeof opts.dev === "boolean") this.dev = !!opts.dev;
    if (opts.baseUrl) this.baseUrl = opts.baseUrl;

    if (this.dev) this.baseUrl = this.baseUrl.replace(/\/?$/, "/");

    this.fingerprint = await generateFingerprint();

    // auto hydrate when configured
    if (opts.autoHydrate !== false && typeof window !== "undefined") {
      // Wait for DOM ready then scan and schedule
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", () => this.autoHydrate(opts));
      } else {
        this.autoHydrate(opts);
      }
    }

    return this;
  }

  /** Internal: starts scanning and scheduling hydration */
  private async autoHydrate(opts: FoundySDKOptions) {
    try {
      const jobs = scanForHydrationJobs();
      // attach a runner that knows how to fetch & hydrate single job
      const runner = async (job: HydrationJob) => {
        const cacheKey = `${job.type}:${job.name || ""}`;
        // Try cache first
        const cached = this.cache.get(cacheKey);
        if (cached) {
          const item = optsOnlyFind(cached, job.name);
          if (item) return runHydration(job.el, item);
        }
        // fetch from API
        const fetched = await fetchContent({
          baseUrl: this.baseUrl,
          apiUri: this.apiUri,
          jwtToken: this.jwtToken!,
          type: job.type,
          name: job.name,
          args: job.args,
          deviceId: this.fingerprint!,
        });
        if (!Array.isArray(fetched)) return null;
        // cache globally
        this.cache.set(`${job.type}:`, fetched);
        if (job.name) {
          const filtered = fetched.filter((c) => c.data?.title === job.name);
          this.cache.set(`${job.type}:${job.name}`, filtered);
        }
        const item = optsOnlyFind(fetched, job.name);
        console.log(item)
        if (item) runHydration(job.el, item);
      };

      scheduleJobs(jobs, runner);
    } catch (err) {
      // fail silently - hydration should not break the app
      // but expose via console for debugging
      // eslint-disable-next-line no-console
      console.error("Foundy autoHydrate error:", err);
    }

    console.log(this.cache)
  }

  /** Public content fetch API (manual) */
  async content(type: ContentType, name?: string): Promise<ContentItem[] | ContentItem | null> {
    if (!this.jwtToken) throw new Error("Foundy SDK not configured. Call foundy.configure()");
    // cache lookup
    const cacheKey = `${type}:${name || ""}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      if (name) return cached.find((c) => c.data?.title === name) || null;
      return cached;
    }
    const fetched = await fetchContent({
      baseUrl: this.baseUrl,
      apiUri: this.apiUri,
      jwtToken: this.jwtToken,
      type,
      name,
      deviceId: this.fingerprint || (await generateFingerprint()),
    });
    if (Array.isArray(fetched)) {
      this.cache.set(`${type}:`, fetched);
      if (name) this.cache.set(cacheKey, fetched.filter((c) => c.data?.title === name));
      return name ? fetched.find((c) => c.data?.title === name) || null : fetched;
    }
    return null;
  }
}

// helper: pick first matching or fallback to first entry
function optsOnlyFind(arr: ContentItem[], name?: string) {
  if (!name) return arr[0] || null;
  return arr.find((c) => c.data?.title === name) || null;
}

/** singleton */
export const foundy = new FoundySDKClass();

// Auto-config via JSON <script id="foundy-config"> on page (optional)
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    try {
      const id = "foundy-config";
      const el = document.getElementById(id);
      if (!el) return;
      // element must be <script type="application/json" id="foundy-config">{...}</script>
      const json = el.textContent?.trim();
      if (!json) return;
      const cfg = JSON.parse(json) as FoundySDKOptions;
      // If configure was already called by consumer, it's OK - we call again
      // @ts-ignore
      (window as any).foundy.configure(cfg);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Foundy config parse failed:", err);
    }
  });
}
