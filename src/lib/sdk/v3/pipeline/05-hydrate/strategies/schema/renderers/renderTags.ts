import { StyleMap } from "../styleMap";

export function renderTags(data: any): string {
  let tags: string[] = [];
  
  if (Array.isArray(data)) {
    tags = data.map(String);
  } else if (typeof data === 'string') {
    tags = data.split(',').map(t => t.trim()).filter(Boolean);
  }

  if (tags.length === 0) return "";
  let html = ``
//   let html = `<div class="${StyleMap.tagList}">`;
  
  for (const tag of tags) {
    html += `<span class="${StyleMap.tag}">${tag}</span>`;
  }
  
  html += `</div>`;
  
  return html;
}