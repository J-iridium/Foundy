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
  
  const matchedKey = inferSchemaKey(type, data);
  
  let schema = Modals[type as keyof typeof Modals];
  if (matchedKey) {
     schema = schema[matchedKey];
  }

  if (!schema) return "";

  const isRootArray = Array.isArray(schema);

  return renderGroup(schema, data, isRootArray);
}

/**
 * Router: Decides which renderer to use
 */
export function buildField(schema: any, data: any, keyName?: string): string {
  if (data === undefined || data === null) return "";

  if (keyName === "tags") {
    return renderTags(data);
  }

  if (Array.isArray(schema)) {
    return renderList(schema[0], data);
  }

  if (typeof schema === "object") {
    return renderGroup(schema, data, false);
  }

  if (typeof schema === "string") {
    if (schema === "base64") return renderImage(data, keyName);
    if (schema.startsWith("enum_")) return renderEnum(schema, data);
    
    if (schema.endsWith("[]")) {
       return renderList(schema.replace("[]", ""), data);
    }

    return renderPrimitive(schema, data, keyName);
  }

  return "";
}