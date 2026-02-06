import type { ContentType } from "$types/db";
import { getDOMDepth, isInViewport } from "../../utils/domHelper";
import type { HydrationMode } from "../05-hydrate/types";
import { calculateTaskCompletionPriority } from "./calculateTaskPriority";
import { extractAddress } from "./extractElements";
import { normalizeAttributes } from "./normalizeAttributes";
import type { Attributes, ScanTask } from "./types";

export function createTasks(elements : HTMLElement[]) : ScanTask[] {
    const tasks : ScanTask[] = [];
    
    elements.forEach((element : HTMLElement) => {
        const address : string = extractAddress(element);
        const normAttributes : { attributes : Attributes, type : ContentType, mode : HydrationMode} = normalizeAttributes(address);

        const task : ScanTask = {
            address: address,
            type: normAttributes.type,
            mode: normAttributes.mode,
            attributes: normAttributes.attributes,
            priority: 0,
            element: element,

            isInViewport: isInViewport(element,200),
            domDepth: getDOMDepth(element)
        };

        task.priority = calculateTaskCompletionPriority(task);

        tasks.push(task)
    })
    return tasks
}