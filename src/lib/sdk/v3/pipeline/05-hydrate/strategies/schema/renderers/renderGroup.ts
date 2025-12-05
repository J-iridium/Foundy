import { StyleMap } from "../styleMap";
import { buildField } from "../builder"; 

export function renderGroup(
  schema: any, 
  rawData: any, 
  skipWrapper: boolean = false // <--- NEW PARAMETER
): string {
  const content = rawData?.data ?? rawData;
  if (!content || typeof content !== "object") return "";

  // ---------------------------------------------------------
  // ARRAY HANDLER
  // ---------------------------------------------------------
  if (Array.isArray(schema) && Array.isArray(content)) {
    const itemSchema = schema[0]; 
    let html = "";

    // 1. Render all children
    for (const itemData of content) {
       // Deep children are NEVER wrappers; they are always items
       // So we pass skipWrapper = false for children
       html += renderGroup(itemSchema, itemData, false);
    }
    
    // 2. CHECK: Do we wrap it or return raw items?
    if (skipWrapper) {
      // Return raw HTML fragments. 
      // The parent DOM element (which has display:grid) will act as the container.
      return html; 
    }

    // Otherwise, wrap it (standard list behavior)
    const containerClass = StyleMap.listContainer ?? "foundy-list";
    return `<div class="${containerClass}">${html}</div>`;
  }

  // ---------------------------------------------------------
  // OBJECT HANDLER
  // ---------------------------------------------------------
  if (typeof schema === "object" && !Array.isArray(schema)) {
    // Objects usually always need a wrapper to group their fields, 
    // UNLESS you specifically want to spread fields into a parent grid too.
    // For now, let's assume Objects always keep their wrapper.
    
    let html = `<div class="${StyleMap.container}">`;
    
    // ... (rest of object logic is same as before) ...
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