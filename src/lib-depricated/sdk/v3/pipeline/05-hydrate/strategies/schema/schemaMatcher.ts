import { Modals } from "$types/generated/Modals";

/**
 * Heuristic Function: Guesses which schema key matches the data structure.
 * * @param rootType The main page type (e.g. "homepage")
 * @param data The unknown data object or array
 * @returns The key name (e.g. "faq", "pricing") if found, or null.
 */
export function inferSchemaKey(rootType: string, data: any): string | null {
  const rootSchema = Modals[rootType as keyof typeof Modals];
  if (!rootSchema || !data) return null;

  // If data is an array, we look at the first item to guess the structure.
  const dataToInspect = Array.isArray(data) ? data[0] : data;
  if (!dataToInspect) return null; 

  const dataKeys = Object.keys(dataToInspect).sort().join(",");

  for (const [schemaKey, schemaDefinition] of Object.entries(rootSchema)) {
    
    const isSchemaArray = Array.isArray(schemaDefinition);
    const isDataArray = Array.isArray(data);

    if (isSchemaArray !== isDataArray) {
      continue; 
    }

    const defToInspect = isSchemaArray ? schemaDefinition[0] : schemaDefinition;
    
    if (typeof defToInspect !== 'object') continue; 

    const schemaKeys = Object.keys(defToInspect).sort().join(",");

    if (dataKeys === schemaKeys) {
      console.log(`[Foundy Matcher] Data matched with key: ${schemaKey}`);
      return schemaKey;
    }
  }

  return null; 
}