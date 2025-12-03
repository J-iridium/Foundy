import type { HydrationJob } from "../core/types";
import { parseFoundyDataset } from "./jobs";

/**
 * Find all elements with [data-foundy] and build HydrationJob list.
 * Priority resolution:
 *  - If element has data-priority attribute (0..10) use that
 *  - Else auto-score based on viewport position (top => higher)
 */
export function scanForHydrationJobs(): HydrationJob[] {
    if (typeof document === "undefined") return [];
  const els = Array.from(document.querySelectorAll("[data-foundy]"));
  const jobs: HydrationJob[] = els
    .map((el : Element) => {
      const raw = el.dataset.foundy ?? "";
      const parsed = parseFoundyDataset(raw);
      if (!parsed) return null;
      
      // manual priority override
      const manual = el.dataset.priority;
      const manualNum = manual ? Number(manual) : NaN;

      // auto scoring
      const rect = el.getBoundingClientRect();
      // top positions (rect.top close to 0) => higher score
      const top = Math.max(0, rect.top || 0);
      // scale top to a 0..9 where 0 is very top; invert so top->10
      const autoScore = Math.round(10 - Math.min(top / 300, 9));

      const priority = Number.isFinite(manualNum) && !Number.isNaN(manualNum)
        ? Math.max(0, Math.min(10, Math.round(manualNum)))
        : Math.max(0, Math.min(10, autoScore));

      return {
        el,
        type: parsed.type,
        name: parsed.name,
        args: parsed.args,
        priority,
      } as HydrationJob;
    })
    .filter(Boolean) as HydrationJob[];
  return jobs;
}
