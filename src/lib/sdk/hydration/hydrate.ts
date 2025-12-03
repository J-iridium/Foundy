import type { ContentItem } from "../core/types";

/**
 * Hydration renderer: apply a ContentItem into an element.
 * - If content.data.html exists -> replace innerHTML
 * - Else if content.data.text exists -> use textContent
 * - Else fallback to JSON dump (stringified)
 */
export function runHydration(el: HTMLElement, content: ContentItem) {
  try {
    const d = content?.data;
    console.log(content)
    if (!d) {
      el.textContent = "";
      return;
    }
    if (typeof d.html === "string") {
      // Use a safe-innerHTML pattern: consumer should sanitize server HTML or server must send safe markup.
      el.innerHTML = d.html;
      return;
    }
    if (typeof d.text === "string") {
      el.textContent = d.text;
      return;
    }
    // fallback - compact JSON for debugging
    el.textContent = typeof d === "string" ? d : JSON.stringify(d);
  } catch (err) {
    // avoid breaking page rendering
    // eslint-disable-next-line no-console
    console.error("Foundy hydrate error", err);
  }
}
