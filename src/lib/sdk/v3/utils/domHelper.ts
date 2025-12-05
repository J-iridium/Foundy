/**
 * utils/domHelpers.ts
 * A collection of PURE functions for interacting with the DOM.
 * These functions do not hold state. They only measure or modify 
 * the elements passed to them.
 */

// ==========================================
//      SCANNING & METADATA (Read-Only)
// ==========================================

/**
 * Extracts all `data-foundy-*` attributes into a clean dictionary.
 * Useful if you later decide to support `data-foundy-mode="html"` 
 * alongside the main syntax string.
 */
export function getAttributeMap(element: HTMLElement): Record<string, string> {
  const map: Record<string, string> = {};
  
  // Iterate over dataset (standard API for data-* attributes)
  for (const key in element.dataset) {
    if (key.startsWith('foundy')) {
      map[key] = element.dataset[key] || "";
    }
  }
  
  return map;
}

/**
 * Calculates how deep an element is in the DOM tree relative to the body.
 * Used for Priority: Shallower elements (depth < 5) often imply 
 * higher structural importance (headers, layout) than deep ones.
 */
export function getDOMDepth(element: HTMLElement): number {
  let depth = 0;
  let current = element.parentElement;
  
  while (current && current !== document.body) {
    depth++;
    current = current.parentElement;
  }
  
  return depth;
}

/**
 * Generates a unique CSS selector for debugging.
 * Example output: "body > div#app > section.hero > div:nth-child(2)"
 * Crucial for error logging when a specific ScanTask fails.
 */
export function generateUniqueSelector(element: HTMLElement): string {
  if (element.id) return `#${element.id}`;
  if (element.tagName === 'BODY') return 'body';

  const parent = element.parentElement;
  if (!parent) return element.tagName.toLowerCase();

  const siblings = Array.from(parent.children);
  const index = siblings.indexOf(element) + 1;

  return `${generateUniqueSelector(parent)} > ${element.tagName.toLowerCase()}:nth-child(${index})`;
}

// ==========================================
//       VISIBILITY & PRIORITY (Read-Only)
// ==========================================

/**
 * Checks if an element is currently within the viewport.
 * @param buffer - Extra pixels around the viewport to consider "visible" (default 0).
 * Use a buffer (e.g. 200) to prefetch content just off-screen.
 */
export function isInViewport(element: HTMLElement, buffer: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  const vHeight = window.innerHeight || document.documentElement.clientHeight;
  const vWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top < vHeight + buffer &&
    rect.bottom > -buffer &&
    rect.left < vWidth + buffer &&
    rect.right > -buffer
  );
}

/**
 * Checks if an element is hidden via CSS, even if it's in the viewport.
 * If display is none, opacity is 0, or visibility is hidden, 
 * it should likely have very low priority.
 */
export function isVisuallyHidden(element: HTMLElement): boolean {
  // Optimization: Check inline style first to avoid expensive getComputedStyle
  if (element.style.display === 'none' || element.style.visibility === 'hidden') return true;

  const style = window.getComputedStyle(element);
  return (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  );
}

// ==========================================
//       MANIPULATION & HYDRATION (Write)
// ==========================================

/**
 * Inject HTML content safely. 
 * NOTE: Does not prevent all XSS if the API returns malicious scripts.
 * Use this for your "HTML Mode" where raw content is expected.
 */
export function safeInjectHTML(element: HTMLElement, htmlString: string): void {
  // Basic sanity check: prevent injecting obvious script tags
  if (htmlString.toLowerCase().includes("<script")) {
    console.warn(`[Foundy] Blocked potential XSS in content for`, element);
    element.innerText = "Error: Content blocked due to security restrictions.";
    return;
  }

  element.innerHTML = htmlString;
}

/**
 * Removes the container element but keeps the content.
 * Useful if the developer used a `<div>` just for the data-foundy attribute
 * but doesn't want that div to mess up their CSS grid/flexbox.
 */
export function unwrapContainer(element: HTMLElement): void {
  const parent = element.parentNode;
  
  if (parent) {
    // Move all children out to the parent
    while (element.firstChild) {
      parent.insertBefore(element.firstChild, element);
    }
    // Remove the empty container
    parent.removeChild(element);
  }
}