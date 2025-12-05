import { StyleMap } from "../styleMap";
import { buildField } from "../builder"; 

export function renderGroup(
  schema: any, 
  rawData: any, 
  skipWrapper: boolean = false 
): string {
  const content = rawData?.data ?? rawData;
  if (!content || typeof content !== "object") return "";

  // ---------------------------------------------------------
  // ARRAY HANDLER
  // ---------------------------------------------------------
  if (Array.isArray(schema) && Array.isArray(content)) {
    const itemSchema = schema[0]; 
    let html = "";

    for (const itemData of content) {
       html += renderGroup(itemSchema, itemData, false);
    }
    
    if (skipWrapper) {
      return html; 
    }

    const containerClass = StyleMap.listContainer ?? "foundy-list";
    return `<div class="${containerClass}">${html}</div>`;
  }

  // ---------------------------------------------------------
  // OBJECT HANDLER
  // ---------------------------------------------------------
  if (typeof schema === "object" && !Array.isArray(schema)) {
    let html = `<div class="${StyleMap.container}">`;
    
    for (const [key, fieldType] of Object.entries(schema)) {
      const fieldData = content[key];
      if (fieldData === undefined) continue;
      html += `<div class="${StyleMap.field(key)}">`;
      html += buildField(fieldType, fieldData, key); 
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  }

  return "";
}