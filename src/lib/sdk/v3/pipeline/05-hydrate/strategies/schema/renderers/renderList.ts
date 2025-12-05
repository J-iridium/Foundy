import { StyleMap } from "../styleMap";
import { buildField } from "../builder"; 

export function renderList(itemSchema: any, data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) return "";

  let html = `<div class="${StyleMap.list}">`;

  for (const item of data) {
    html += `<div class="${StyleMap.listItem}">`;
    html += buildField(itemSchema, item);
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}