// src/pipeline/05-hydrate/strategies/schema/styleMap.ts

export const StyleMap = {
  // Layouts
  container: "foundy-group",
  list: "foundy-list",
  listItem: "foundy-list-item",
  
  // Primitives
  text: "foundy-text",
  title: "foundy-title",
  subtitle: "foundy-subtitle",
  number: "foundy-number",
  
  // Media
  image: "foundy-image",
  
  // Components
  badge: "foundy-badge",
  error: "foundy-error",
  
  // Dynamic class generator
  field: (key: string) => `foundy-field-${key}`,
  enumVariant: (name: string) => `foundy-enum-${name}`
} as const;