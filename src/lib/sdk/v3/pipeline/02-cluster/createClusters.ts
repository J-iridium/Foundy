// Central binder for pipeline 02-jobs executing
// get all tasks, calculate priority, normalize the attributes of the element.
// construct job object and return.

import type { ScanTask } from "../01-scan/types";
import type { FetchJob } from "../04-fetch/types";

export function clusterTasks(ScanTask : ScanTask[]) : FetchJob[] {
    const groups : [string, ScanTask[]] = groupByAdress(tasks);
    const jobs : FetchJob[] = [];

    for (const [address, groupTasks] of Object.entries(groups)) {
        const priority = calculateJobPriority(groupTasks);

        jobs.push({
            kind: "keyed",
            address,
            keys: [],
            priority: 0,
            tasks: groupTasks,
            status: "pending"
        })
    }

    return job
}