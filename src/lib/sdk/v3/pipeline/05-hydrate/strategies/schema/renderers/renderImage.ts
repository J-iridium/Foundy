import { StyleMap } from "../styleMap";

export function renderImage(data: any, alt: string = ""): string {
  const src = String(data);
  return `<img 
    src="${src}" 
    alt="${alt}" 
    class="${StyleMap.image}" 
    loading="lazy" 
  />`;
}