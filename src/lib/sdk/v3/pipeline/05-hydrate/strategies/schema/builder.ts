import { Modals } from "$types/generated/Modals"; 
import { renderGroup } from "./renderers/renderGroup";
import { renderList } from "./renderers/renderList";
import { renderImage } from "./renderers/renderImage";
import { renderEnum } from "./renderers/renderEnum";
import { renderPrimitive } from "./renderers/renderPrimitive";
import { renderTags } from "./renderers/renderTags"; 
import { StyleMap } from "./styleMap";
import { inferSchemaKey } from "./schemaMatcher";

/**
 * Entry Point: Generates HTML for a specific Content Type
 */
export function generateHtmlFromSchema(type: string, rawData: any): string {
  const data = rawData?.data ?? rawData;
  
  // 1. Match Schema (using your matcher or direct lookup)
  const matchedKey = inferSchemaKey(type, data);
  
  let schema = Modals[type as keyof typeof Modals];
  if (matchedKey) {
     schema = schema[matchedKey];
  }

  if (!schema) return "";

  // 2. CRITICAL DECISION
  // If the Root Schema is an Array, we want to skip the internal wrapper
  // because the HTML element we are injecting into IS the container.
  const isRootArray = Array.isArray(schema);

  // We pass 'true' for skipWrapper if it is an array
  return renderGroup(schema, data, isRootArray);
}

/**
 * Router: Decides which renderer to use
 */
export function buildField(schema: any, data: any, keyName?: string): string {
  if (data === undefined || data === null) return "";

  // 1. Business Logic Overrides (Specific visual components based on Key Name)
  if (keyName === "tags") {
    return renderTags(data);
  }

  // 2. Arrays / Lists (defined in schema as objects, e.g. ["string"])
  if (Array.isArray(schema)) {
    return renderList(schema[0], data);
  }

  // 3. Nested Groups (Objects)
  if (typeof schema === "object") {
    return renderGroup(schema, data, false);
  }

  // 4. Primitives (defined as strings)
  if (typeof schema === "string") {
    // Special Types
    if (schema === "base64") return renderImage(data, keyName);
    if (schema.startsWith("enum_")) return renderEnum(schema, data);
    
    // Generic Array Types (e.g. "string[]" or "tags[]" if defined in schema)
    if (schema.endsWith("[]")) {
       return renderList(schema.replace("[]", ""), data);
    }

    // Standard Primitives (string, number, boolean)
    return renderPrimitive(schema, data, keyName);
  }

  return "";
}