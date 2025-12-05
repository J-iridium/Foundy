import { StyleMap } from "../styleMap";
import { buildField } from "../builder"; 

export function renderGroup(schema: object, data: any): string {
  if (typeof data !== "object" || data === null) return "";

  let html = `<div class="${StyleMap.container}">`;
  for (const [key, fieldType] of Object.entries(schema)) {
    const fieldData = data.data[key];
    console.log(fieldData, key)

    if (fieldData === undefined) continue;
    html += `<div class="${StyleMap.field(key)}">`;
    html += buildField(fieldType, fieldData, key); 
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}