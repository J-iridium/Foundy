import { StyleMap } from "../styleMap";

export function renderEnum(schemaType: string, data: any): string {
  const enumName = schemaType.replace("enum_", "");
  const value = String(data);

  return `<span class="${StyleMap.badge} ${StyleMap.enumVariant(enumName)}">
    ${value}
  </span>`;
}