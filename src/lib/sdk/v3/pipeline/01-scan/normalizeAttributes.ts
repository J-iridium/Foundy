import type { ContentType } from "$types/db";
import type { HydrationMode } from "../05-hydrate/types";
import type { Attributes } from "./types";

/**
 * Parses the raw string syntax into a structured object.
 * Syntax format: type:name<nested>:index-count
 */
export function normalizeAttributes(rawString: string): { attributes: Attributes, mode: HydrationMode } {
  const attributes: Attributes = {
    nestedContents: []
  };

  // Example Input: "product:shoe1<title>"  
  // Extract Nested Content <...>
  let cleanString : string = rawString;
  const nestedMatch = rawString.match(/<([^>]+)>/); 
  if (nestedMatch) {
    attributes.nestedContents = nestedMatch[1].split("."); 
    cleanString = rawString.replace(nestedMatch[0], ""); 
  }

  // Extract Pagination/Index :1-10
  const parts : string[] = cleanString.split(":");
  const type : ContentType = parts[0] as ContentType; // "product"
  
  // Check for index/count at the end
  const lastPart = parts[parts.length - 1];
  if (lastPart.includes("-") && !isNaN(parseInt(lastPart[0]))) {
    const [index, count] = lastPart.split("-").map(Number);
    attributes.index = index;
    attributes.count = count;
    parts.pop(); // Remove index part
  }

  // Extract Name
  // If there was a name (e.g. product:shoe1), it's the second part
  if (parts.length > 1) {
    attributes.name = parts[1];
  }

  // Determine Mode automatically
  // If nested content exists -> User wants specific data -> "element" mode
  // If no nested content -> User wants full component -> "html" mode
  const mode: HydrationMode = (attributes.nestedContents?.length ?? 0) > 0 
    ? "element" 
    : "html";

  return { attributes: { type, ...attributes }, mode };
}