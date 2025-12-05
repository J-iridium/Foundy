const CSS_ID = "foundy-styles";

const CSS = `
  .foundy-card { border: 1px solid #ddd; padding: 1rem; border-radius: 8px; font-family: sans-serif; }
  .foundy-image { width: 100%; border-radius: 4px; }
  .foundy-title { margin: 0 0 0.5rem 0; }
  .foundy-text { color: #555; font-size: 0.9rem; }
  .foundy-loading { opacity: 0.5; }
  .foundy-error { border: 1px solid red; background: #fff0f0; }
`;

export function injectDefaultStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(CSS_ID)) return;

  const style = document.createElement("style");
  style.id = CSS_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}