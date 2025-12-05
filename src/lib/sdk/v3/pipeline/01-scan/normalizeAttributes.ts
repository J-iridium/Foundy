import type { ContentType } from "$types/db";
import type { HydrationMode } from "../05-hydrate/types";
import type { Attributes } from "./types";
import { Modals } from "$types/generated/Modals";

/**
 * Follow the schema through nested keys
 */
function followSchema(root: any, path: string[]) {
  let current = root;

  for (const seg of path) {
    if (current == null) return null;

    // array — follow into element type
    if (Array.isArray(current)) {
      current = current[0];
      continue;
    }

    current = current[seg];
  }

  return current;
}

/**
 * Check if schema is primitive
 */
function isPrimitive(schema: any): boolean {
  if (schema == null) return false;

  if (typeof schema === "string") {
    return (
      schema === "string" ||
      schema === "number" ||
      schema === "boolean" ||
      schema === "base64" ||
      schema.startsWith("enum_") ||
      schema.endsWith("[]")
    );
  }

  return false;
}

/**
 * Check if value is a component object or list
 */
function isComponent(schema: any): boolean {
  if (schema == null) return false;

  // object = component
  if (typeof schema === "object") return true;

  // array = component list
  if (Array.isArray(schema)) return true;

  return false;
}

/**
 * The final mode detection: based on schema type, not nesting level.
 */
function determineMode(type: ContentType, nested: string[]): HydrationMode {
  const rootSchema = Modals[type];
  if (!rootSchema) return "html";

  const schema = followSchema(rootSchema, nested);

  if (isComponent(schema)) return "html";
  if (isPrimitive(schema)) return "element";

  // fallback: if unknown, assume primitive hydration
  return "element";
}

/**
 * Parses the raw string syntax into a structured object.
 * Handles nested <...<...>>.
 *
 * Example: homepage:name<faq<a>>:1-10
 */
export function normalizeAttributes(
  rawString: string
): { attributes: Attributes; type: ContentType; mode: HydrationMode } {
  const attributes: Attributes = { nestedContents: [] };

  let cleanString = rawString.trim();

  // Extract nested <...>
  const firstLeft = cleanString.indexOf("<");
  const lastRight = cleanString.lastIndexOf(">");

  if (firstLeft !== -1 && lastRight !== -1 && lastRight > firstLeft) {
    const inner = cleanString.substring(firstLeft + 1, lastRight);

    // inner: "faq<a"  --> ["faq", "a"]
    attributes.nestedContents = inner
      .split("<")
      .map((s) => s.replace(">", "").trim())
      .filter(Boolean);

    cleanString =
      cleanString.slice(0, firstLeft) + cleanString.slice(lastRight + 1);
    cleanString = cleanString.trim();
  }

  // remove trailing or duplicate colons
  cleanString = cleanString.replace(/:+$/, "").replace(/:+/g, ":");

  const parts = cleanString.split(":").filter(Boolean);

  const type = (parts[0] ?? "") as ContentType;

  // Index/count (x-y)
  const last = parts[parts.length - 1];
  if (/^\d+-\d+$/.test(last)) {
    const [index, count] = last.split("-").map(Number);
    attributes.index = index;
    attributes.count = count;
    parts.pop();
  }

  // name
  if (parts.length > 1) {
    attributes.name = parts[1];
  }

  // Determine hydration mode using schema rules
  const mode = determineMode(type, attributes.nestedContents ?? []);

  return {
    attributes: { ...attributes },
    type,
    mode,
  };
}
