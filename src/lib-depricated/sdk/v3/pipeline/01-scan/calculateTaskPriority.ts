import type { ScanTask } from "./types";

export function calculateTaskCompletionPriority(task: ScanTask): number {
  let score = 0;

  // Visible items hydrate first
  score += task.isInViewport ? 0 : 500;

  // Shallow DOM = structurally important
  score += (task.domDepth ?? 10) * 10;

  // Nested structures hydrate later
  score += (task.attributes.nestedContents?.length ?? 0) * 50;

  // List items hydrate later
  if (task.attributes.index !== undefined) score += 150;
  if (task.attributes.count !== undefined) score += 50;

  return score;
}
