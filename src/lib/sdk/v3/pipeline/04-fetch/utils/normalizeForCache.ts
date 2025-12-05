import type { FetchJob } from "../types";
import type { CacheItemInput } from "../../03-cache/types";

/**
 * transforms raw API response into Cache Inputs.
 * Handles the logic of calculating Global Indexes for pagination.
 */
export function normalizeForCache(data: any[], job: FetchJob): CacheItemInput[] {
  const cacheInputs: CacheItemInput[] = [];
  const startingOffset = job.kind === 'range' ? job.range[0] : -1;

  data.forEach((item, i) => {
    const type = item.type;
    const name = item.data?.title || item.data?.name;
    
    if (!type || !name) return;

    const cacheInput: CacheItemInput = {
      address: `${type}:${name}`,
      data: { ...item }, 
      type: type
    };

    if (startingOffset !== -1) {
      const globalIndex = startingOffset + i;
      cacheInput.index = globalIndex;
    }

    cacheInputs.push(cacheInput);
  });

  return cacheInputs;
}