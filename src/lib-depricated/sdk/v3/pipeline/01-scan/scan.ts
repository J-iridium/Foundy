import { createTasks } from "./createTasks";
import { expandRangeTasks } from "./expandRangeTasks";
import { extractElements } from "./extractElements";
import type { ScanTask } from "./types";

export function scan() : ScanTask[] {
    const initialTasks = createTasks(extractElements());
    return expandRangeTasks(initialTasks);
} 