const CSS_ID = "foundy-styles";

const CSS = `
  :root {
    /* --- Light Theme Variables --- */
    --foundy-bg-surface: #ffffff;
    --foundy-bg-subtle: #f9fafb;
    --foundy-border: #e5e7eb;
    --foundy-text-primary: #111827;
    --foundy-text-secondary: #6b7280;
    --foundy-primary: #3b82f6;
    --foundy-danger-bg: #fef2f2;
    --foundy-danger-border: #fca5a5;
    --foundy-danger-text: #991b1b;
    --foundy-tag-bg: #e0f2fe;
    --foundy-tag-text: #0369a1;
    --foundy-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    
    /* Increased contrast for loader visibility */
    --foundy-loading-base: #e5e7eb;      /* Gray-200 */
    --foundy-loading-highlight: #f9fafb; /* Gray-50 */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      /* --- Dark Theme Variables --- */
      --foundy-bg-surface: #1f2937;
      --foundy-bg-subtle: #374151;
      --foundy-border: #4b5563;
      --foundy-text-primary: #f9fafb;
      --foundy-text-secondary: #9ca3af;
      --foundy-primary: #60a5fa;
      --foundy-danger-bg: #450a0a;
      --foundy-danger-border: #7f1d1d;
      --foundy-danger-text: #fecaca;
      --foundy-tag-bg: #0c4a6e;
      --foundy-tag-text: #bae6fd;
      --foundy-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
      
      --foundy-loading-base: #374151;      /* Gray-700 */
      --foundy-loading-highlight: #4b5563; /* Gray-600 */
    }
  }

  /* --- Keyframes --- */
  @keyframes foundy-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes foundy-fade-in {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* --- Base Styles --- */
  .foundy-group {
    background-color: var(--foundy-bg-surface);
    border: 1px solid var(--foundy-border);
    color: var(--foundy-text-primary);
    padding: 1.5rem;
    border-radius: 12px;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: var(--foundy-shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    max-width: 100%;
    overflow: hidden;
    animation: foundy-fade-in 0.4s ease-out;
  }

  .foundy-group:hover {
    transform: translateY(-20px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .foundy-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    display: block;
    object-fit: cover;
    margin-bottom: 1rem;
    background-color: var(--foundy-bg-subtle);
  }

  .foundy-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--foundy-text-primary);
  }

  .foundy-text {
    color: var(--foundy-text-secondary);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .foundy-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    background-color: var(--foundy-tag-bg);
    color: var(--foundy-tag-text);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    letter-spacing: 0.025em;
  }

  /* --- Loading State (Skeleton) --- */
  .foundy-loading {
    /* Force visibility and structure */
    display: block; 
    width: 100%;
    min-height: 1rem; /* Prevents 0-height collapse */
    border-radius: 6px;
    
    /* Animation & Color */
    background: var(--foundy-loading-base);
    background: linear-gradient(
      90deg,
      var(--foundy-loading-base) 25%,
      var(--foundy-loading-highlight) 50%,
      var(--foundy-loading-base) 75%
    );
    background-size: 200% 100%;
    animation: foundy-shimmer 1.5s infinite linear;
    
    /* Hide text content if any exists while loading */
    color: transparent !important;
    pointer-events: none;
    border: none;
    user-select: none;
  }

  /* Specific structure overrides */
  .foundy-text.foundy-loading {
    height: 0.95rem;
    margin-bottom: 0.75rem;
  }
  
  .foundy-title.foundy-loading {
    width: 70%;
    height: 1.5rem;
    margin-bottom: 1rem;
  }

  .foundy-image.foundy-loading {
    min-height: 200px;
    margin-bottom: 1rem;
  }

  /* Prevent tags from becoming full-width blocks */
  .foundy-tag.foundy-loading {
    display: inline-block;
    width: 60px; /* Default width for loading tag */
    height: 1.5rem;
    margin-bottom: 0.5rem;
  }

  /* --- Error State --- */
  .foundy-error {
    border: 1px solid var(--foundy-danger-border);
    background-color: var(--foundy-danger-bg);
    color: var(--foundy-danger-text);
    padding: 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* --- List Layouts --- */
  .foundy-list {
    display: flex;
    flex-direction: column; /* Default: Vertical stack */
    gap: 1.5rem;            /* Matches the padding of foundy-group */
    width: 100%;
    
    /* Reset default browser list styles */
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Modifier for Horizontal Row */
  .foundy-list.foundy-row {
    flex-direction: row;
    flex-wrap: wrap;       /* Allows items to wrap on smaller screens */
    align-items: stretch;  /* Ensures cards in the same row match height */
  }

  /* Optional: Helper to make items share equal width in row mode */
  .foundy-list.foundy-row > .foundy-group {
    flex: 1 1 300px;       /* Grow, Shrink, Basis (min-width before wrapping) */
  }
`;

export function injectDefaultStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(CSS_ID)) return;

  const style = document.createElement("style");
  style.id = CSS_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}