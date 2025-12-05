export function setStatus(element: HTMLElement, status: "loading" | "hydrated"): void {
  element.classList.remove("foundy-loading", "foundy-error");
  element.setAttribute("data-foundy-status", status);
  
  if (status === "loading") {
    element.classList.add("foundy-loading");
  }
}

export function setError(element: HTMLElement, msg: string): void {
  element.classList.remove("foundy-loading");
  element.classList.add("foundy-error");
  element.setAttribute("data-foundy-status", "error");
  
  if (!element.innerText.trim()) {
    element.innerText = "Unavailable";
  }
}