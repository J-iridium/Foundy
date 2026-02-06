import type { HydrationJob } from "../core/types";

/**
 * scheduleJobs: accepts jobs and a runner(job) function that returns a promise.
 * Behavior:
 *  - Sort jobs by priority descending
 *  - Run top-priority batch (priority >= 8) in parallel immediately
 *  - Stagger remaining jobs with delays proportional to priority (lower priority => larger delay)
 *
 * runner: (job) => Promise<void>
 */
export function scheduleJobs(jobs: HydrationJob[], runner: (job: HydrationJob) => Promise<any>) {
  if (!jobs || jobs.length === 0) return;

  // sort by priority desc, then by DOM order (jobs array order)
  jobs.sort((a, b) => b.priority - a.priority);

  // run high priority (>=8) in parallel but cap concurrency to 6
  const high = jobs.filter((j) => j.priority >= 8);
  const mid = jobs.filter((j) => j.priority >= 4 && j.priority < 8);
  const low = jobs.filter((j) => j.priority < 4);

  // helper concurrency runner
  const runConcurrent = async (list: HydrationJob[], concurrency = 6) => {
    const queue = list.slice();
    const active: Promise<any>[] = [];

    const next = async () => {
      if (queue.length === 0) return Promise.resolve();
      const job = queue.shift()!;
      const p = runner(job).catch((e) => {
        // swallow per-job errors so others continue
        // eslint-disable-next-line no-console
        console.warn("Foundy job failed:", e);
      });
      active.push(p);
      p.finally(() => {
        const idx = active.indexOf(p);
        if (idx >= 0) active.splice(idx, 1);
      });
      if (active.length < concurrency && queue.length > 0) {
        return next();
      }
      return Promise.race(active).then(() => next());
    };

    // spawn initial workers
    const initial = Math.min(concurrency, queue.length);
    const starters = [];
    for (let i = 0; i < initial; i++) starters.push(next());
    await Promise.all(starters);
    // wait for remaining active
    await Promise.all(active);
  };

  // run high immediately (concurrently)
  runConcurrent(high, 6).catch(() => { /* ignore */ });

  // schedule mid priority with small stagger
  let delayBase = 50; // ms
  mid.forEach((job, idx) => {
    const delay = delayBase + idx * 150 - job.priority * 10;
    setTimeout(() => {
      runner(job).catch(() => {});
    }, Math.max(0, delay));
  });

  // schedule low priority with larger stagger, spread over time to reduce server load
  low.forEach((job, idx) => {
    const delay = 800 + idx * 500 + (10 - job.priority) * 120;
    setTimeout(() => {
      runner(job).catch(() => {});
    }, delay);
  });
}
