import type { HydrateJob } from "./types";
import { injectDefaultStyles } from "./styles/defaultStyles";
import { setStatus, setError } from "./utils/domStatus";
import { resolveData } from "./utils/resolveData";
import { executeStrategy } from "./strategies";

/**
 * 1. INITIALIZATION
 */
export function initHydration() {
  injectDefaultStyles();
}

/**
 * 2. EXECUTION
 */
export function hydrate(job: HydrateJob): void {
  const { task, data, error } = job;

  if (error || !data) {
    if (task.attributes.index !== undefined) {
        task.element.remove();
        console.debug(`[Foundy] Removed empty indexed element: ${task.address}`);
    } else {
        setError(task.element, "Fetch Failed");
    }
    return;
  }
  const content = resolveData(data, task.attributes.nestedContents);
  if (content === undefined) {
    if (task.attributes.index !== undefined) {
        task.element.remove();
    } else {
        setError(task.element, "Data Missing");
    }
    return;
  }

  try {
    executeStrategy(task, content);
    setStatus(task.element, "hydrated");
  } catch (err) {
    console.error(`[Foundy] Hydration crashed for ${task.address}`, err);
    setError(task.element, "Render Error");
  }
}