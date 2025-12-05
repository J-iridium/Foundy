import { Modals } from "../../../../../../../types/generated/Modals"; // Adjust path to your Modals.ts
import { renderGroup } from "./renderers/renderGroup";
import { renderList } from "./renderers/renderList";
import { renderImage } from "./renderers/renderImage";
import { renderEnum } from "./renderers/renderEnum";
import { renderPrimitive } from "./renderers/renderPrimitive";
import { StyleMap } from "./styleMap";

/**
 * Entry Point: Generates HTML for a specific Content Type (e.g. "homepage")
 */
export function generateHtmlFromSchema(type: string, data: any): string {
  const schema = Modals[type as keyof typeof Modals];
  if (!schema) {
    console.warn(`[Foundy] Unknown Schema: ${type}`);
    return `<div class="${StyleMap.error}">Unknown Content Type: ${type}</div>`;
  }

  return `<div class="foundy-content-${type}">
    ${buildField(schema, data)}
  </div>`;
}

/**
 * Router: Decides which renderer to use
 */
export function buildField(schema: any, data: any, keyName?: string): string {
  if (data === undefined || data === null) return "";
  if (Array.isArray(schema)) {
    return renderList(schema[0], data);
  }

  if (typeof schema === "object") {
    return renderGroup(schema, data);
  }

  if (typeof schema === "string") {
    if (schema === "base64") return renderImage(data, keyName);
    if (schema.startsWith("enum_")) return renderEnum(schema, data);
    return renderPrimitive(schema, data, keyName);
  }

  return "";
}