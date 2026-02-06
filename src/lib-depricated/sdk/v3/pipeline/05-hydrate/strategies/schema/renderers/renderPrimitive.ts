import { StyleMap } from "../styleMap";

export function renderPrimitive(schemaType: string, data: any, keyName?: string): string {
  const value = String(data);
  const lowerKey = keyName?.toLowerCase() || "";

  if (schemaType === "number") {
    const formatted = new Intl.NumberFormat().format(Number(data));
    return `<span class="${StyleMap.number}">${formatted}</span>`;
  }

  if (value.includes("<") && value.includes(">") && lowerKey.includes("html")) {
    return value;
  }

  if (lowerKey === "title" || lowerKey === "name" || lowerKey === "subject") {
    return `<h3 class="${StyleMap.title}">${value}</h3>`;
  }

  return `<p class="${StyleMap.text}">${value}</p>`;
}