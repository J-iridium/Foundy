import type { ScanTask } from "../../01-scan/types";
import { hydrateHtml } from "./hydrateHtml";
import { hydrateElement } from "./hydrateElement";

export function executeStrategy(task: ScanTask, content: any): void {
  if (task.mode === "html") {
    hydrateHtml(task.element, content, task.type);
  } else {
    hydrateElement(task.element, content);
  }
}

