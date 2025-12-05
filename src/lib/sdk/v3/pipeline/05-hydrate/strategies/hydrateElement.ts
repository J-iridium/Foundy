export function hydrateElement(element: HTMLElement, value: any): void {
  const tagName = element.tagName;
  const str = String(value ?? "");

  switch (tagName) {
    case "IMG":
      if (typeof value === "object" && value.url) {
        (element as HTMLImageElement).src = value.url;
        if (value.alt) (element as HTMLImageElement).alt = value.alt;
      } else {
        (element as HTMLImageElement).src = str;
      }
      break;

    case "A":
      const link = element as HTMLAnchorElement;
      if (str.startsWith("http") || str.startsWith("/")) {
        link.href = str;
      } else {
        link.innerText = str;
      }
      break;

    case "INPUT":
    case "TEXTAREA":
      (element as HTMLInputElement).value = str;
      break;

    default:
      element.innerText = str;
  }
}