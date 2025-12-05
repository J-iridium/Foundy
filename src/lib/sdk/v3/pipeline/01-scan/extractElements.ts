/**
 * Scans the document for all elements containing the 'data-foundy' attribute.
 * Returns a distinct array of HTMLElements.
 */
export function extractElements(): HTMLElement[] {
  // Using querySelectorAll is fast and native.
  const nodeList = document.querySelectorAll<HTMLElement>("[data-foundy]");

  return Array.from(nodeList);
}