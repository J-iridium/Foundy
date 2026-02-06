import { safeInjectHTML } from "../../../utils/domHelper";
import { generateHtmlFromSchema } from "./schema/builder";

export function hydrateHtml(element: HTMLElement, data: any, type: string): void {
  if (typeof data === "string") {
    safeInjectHTML(element, data);
    return;
  }

  if (typeof data === "object" && data !== null) {
    const html = generateHtmlFromSchema(type, data);
    safeInjectHTML(element, html);
  }
}