import type { ScanTask } from "../01-scan/types";

/**
 * Groups a flat array of ScanTasks by their unique address.
 * * Input:  [Task(product:A), Task(product:B), Task(product:A)]
 * Output: { 
 * "product:A": [Task, Task], 
 * "product:B": [Task] 
 * }
 */
export function groupByAddress(tasks: ScanTask[]): Record<string, ScanTask[]> {
  const groups: Record<string, ScanTask[]> = {};

  for (const task of tasks) {
    const key = task.address;

    // Initialize the array if this is the first time seeing this address
    if (!groups[key]) {
      groups[key] = [];
    }

    // Add the task to the group
    groups[key].push(task);
  }

  return groups;
}