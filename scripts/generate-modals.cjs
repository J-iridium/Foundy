const ts = require("typescript/lib/typescript.js");
const fs = require("fs");
const path = require("path");

// -------------------------
// Configuration
// -------------------------
const CONTENT_DIR = "./src/types/db/content";
const T_DIR = "./src/types/db/content/T";
const OUTPUT_MODELS = "./src/types/generated/Modals.ts";
const OUTPUT_SCHEMAS = "./src/types/generated/ContentSchemas.ts";
const ENUM_FILE = "./src/types/generated/EnumDictionary.ts";

// -------------------------
// Load EnumDictionary as plain object
// -------------------------
let ENUM_DICTIONARY = {};
if (fs.existsSync(ENUM_FILE)) {
  const text = fs.readFileSync(ENUM_FILE, "utf-8");
  const match = text.match(/export const EnumDictionary\s*=\s*(\{[\s\S]*\})\s*as const/);
  if (match) ENUM_DICTIONARY = eval("(" + match[1] + ")");
}

// -------------------------
// Cache to prevent infinite recursion
// -------------------------
const processedInterfaces = new Map();

// -------------------------
// Parse TypeScript file
// -------------------------
function parseFile(filePath) {
  const program = ts.createProgram([filePath], {});
  return program.getSourceFile(filePath);
}

// -------------------------
// Get Basic Types
// -------------------------
function getTypeText(typeNode) {
  if (!typeNode) return "any";

  switch (typeNode.kind) {
    case ts.SyntaxKind.StringKeyword: return "string";
    case ts.SyntaxKind.NumberKeyword: return "number";
    case ts.SyntaxKind.BooleanKeyword: return "boolean";
    case ts.SyntaxKind.AnyKeyword: return "any";
    case ts.SyntaxKind.ArrayType:
      return getTypeText(typeNode.elementType) + "[]";
    case ts.SyntaxKind.TypeReference:
      return typeNode.typeName.escapedText;
    default:
      return "any";
  }
}

// -------------------------
// Recursively get interface properties
// -------------------------
function getInterfaceProperties(interfaceName, tFiles) {
  if (processedInterfaces.has(interfaceName)) return processedInterfaces.get(interfaceName);

  const interfaceFile = tFiles.find(f => f.includes(interfaceName + ".T.ts"));
  if (!interfaceFile) return {}; // skip if not found

  const source = parseFile(interfaceFile);
  if (!source) return {};

  const props = {};
  const fullText = source.getFullText();

  ts.forEachChild(source, node => {
    if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
      node.members.forEach(member => {
        if (!member.name) return; // skip computed properties
        const key = member.name.escapedText;
        const typeText = member.type.typeName ? member.type.typeName.escapedText : getTypeText(member.type);

        // -------------------------
        // Check for //no comment safely
        // -------------------------
        let hasNoComment = false;
        if (member.pos !== undefined && member.end !== undefined) {
          const comments = ts.getLeadingCommentRanges(fullText, member.pos);
          if (comments) {
            // TODO: FIX comment checking 
            hasNoComment = comments.some(r => fullText.substring(r.pos, r.end).includes("no"));
          }
        }

        // -------------------------
        // Map type to modal type
        // -------------------------
        let mappedType = mapType(typeText, tFiles, hasNoComment);
        props[key] = mappedType;
      });
    }
  });

  processedInterfaces.set(interfaceName, props);
  return props;
}

// -------------------------
// Map a TS type string to modal type
// -------------------------
function mapType(typeText, tFiles, hasNoComment) {
  // primitives
  if (/string/.test(typeText) && typeText.endsWith("[]")) return "string[]";
  if (/string/.test(typeText)) return "string";
  if (/number/.test(typeText)) return "number";
  if (/boolean/.test(typeText)) return "boolean";
  if (/base64/.test(typeText)) return "base64";

  // enums
  if (ENUM_DICTIONARY[typeText]) return hasNoComment ? `enum_${typeText}_no` : `enum_${typeText}`;

  // arrays of interfaces
  if (typeText.endsWith("[]")) {
    const innerType = typeText.replace("[]", "");
    return [getInterfaceProperties(innerType, tFiles)];
  }

  // nested objects
  return getInterfaceProperties(typeText, tFiles);
}

// -------------------------
// Scan content type aliases in /content
// -------------------------
const contentFiles = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".ts") && !f.includes("T.ts"));
const tFiles = fs.readdirSync(T_DIR).map(f => path.join(T_DIR, f));

const Modals = {};
const ContentSchemas = {};

for (const file of contentFiles) {
  const source = parseFile(path.join(CONTENT_DIR, file));
  if (!source) continue;

  ts.forEachChild(source, node => {
    if (ts.isTypeAliasDeclaration(node)) {
      // type ContentOf<'name'>
      const typeNode = node.type;
      const text = typeNode.typeName.escapedText === "ContentOf"
      if (
        ts.isTypeReferenceNode(typeNode) &&
        typeNode.typeName.escapedText === "ContentOf" &&
        typeNode.typeArguments?.length === 1
      ) {
        const contentName = typeNode.typeArguments[0].literal.text
        const interfaceName = contentName.slice(0,1).toUpperCase() + contentName.slice(1) + "Data";
        console.log(interfaceName)
        const props = getInterfaceProperties(interfaceName, tFiles);

        Modals[contentName] = props;
        ContentSchemas[contentName] = `{} as ${interfaceName}`;
      }
    }
  });
}

// -------------------------
// Write Modals.ts
// -------------------------
fs.mkdirSync(path.dirname(OUTPUT_MODELS), { recursive: true });
fs.writeFileSync(
  OUTPUT_MODELS,
  "// AUTO-GENERATED FILE - DO NOT EDIT\nexport const Modals = " + JSON.stringify(Modals, null, 2) + " as const;\n"
);

// -------------------------
// Write ContentSchemas.ts
// -------------------------
const typeImports = Object.values(ContentSchemas)
  .map(v => v.match(/as (\w+)/)[1])
  .join(", ");
fs.mkdirSync(path.dirname(OUTPUT_SCHEMAS), { recursive: true });

let schemasText = "// AUTO-GENERATED FILE - DO NOT EDIT\n";
schemasText += `import type { ${typeImports} } from '../db/content/T';\n\n`;
schemasText += "export const ContentSchemas = {\n";
for (const [key, type] of Object.entries(ContentSchemas)) {
  schemasText += `  ${key}: ${type},\n`;
}
schemasText += "} as const;\n";

fs.writeFileSync(OUTPUT_SCHEMAS, schemasText);

console.log("Modals and ContentSchemas generated successfully!");
