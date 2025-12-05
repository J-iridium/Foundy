import type { ContentType } from "$types/db";
import { CalendarMinus } from "@lucide/svelte";
import type { HydrationMode } from "../05-hydrate/types";
import type { Attributes } from "./types";

/**
 * Parses the raw string syntax into a structured object.
 * Handles nested <...<...>> chains and ensures the nested block
 * does not become the "name".
 *
 * Syntax format: type:name<nested<child>>:index-count
 */
export function normalizeAttributes(rawString: string): { attributes: Attributes, type : ContentType, mode: HydrationMode } {
  const attributes: Attributes = { nestedContents: [] };

  let cleanString = rawString.trim();

  // Extract the first outer '<...>' block (including nested '<' inside)
  const firstLeft = cleanString.indexOf("<");
  const lastRight = cleanString.lastIndexOf(">");

  if (firstLeft !== -1 && lastRight !== -1 && lastRight > firstLeft) {
    // substring between the outermost < and the matching last >
    const inner = cleanString.substring(firstLeft + 1, lastRight);

    // inner might be "faq<a" -> split on '<' to produce ["faq", "a"]
    attributes.nestedContents = inner.length ? inner.split("<").map(s => s.trim()).filter(Boolean) : [];
    attributes.nestedContents[attributes.nestedContents.length -1] = attributes.nestedContents[attributes.nestedContents.length -1].split('>')[0]
    
    // remove the entire <...> block from the clean string
    cleanString = (cleanString.slice(0, firstLeft) + cleanString.slice(lastRight + 1)).trim();
  }

  // remove trailing colons and repeated colons that might remain after removal
  cleanString = cleanString.replace(/:+$/, "").replace(/:+/g, ":");

  // Now parse the type, optional name, and optional index-count
  const parts = cleanString.split(":").filter(Boolean); // remove empty segments

  // Expect at least the type
  const type = (parts[0] ?? "") as ContentType;

  // Index/count detection on the last part
  if (parts.length > 0) {
    const last = parts[parts.length - 1];
    if (/^\d+-\d+$/.test(last)) {
      const [index, count] = last.split("-").map(Number);
      attributes.index = index;
      attributes.count = count;
      parts.pop();
    }
  }

  // If there's a second part left, that's the name
  if (parts.length > 1) {
    attributes.name = parts[1];
  } 

  // Determine mode automatically
  const mode: HydrationMode = (attributes.nestedContents?.length ?? 0) > 0 ? "element" : "html";
  return { attributes: {  ...attributes }, type, mode };
}
