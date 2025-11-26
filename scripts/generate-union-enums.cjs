// FORCE the CJS version of TypeScript to avoid "stdin" errors on Windows
const ts = require("typescript/lib/typescript.js");
const fs = require("fs");
const path = require("path");

const TYPES_DIR = "./src/types/db/enums";
const OUTPUT = "./src/types/generated/EnumDictionary.ts";

let dictionary = {};

function extractUnion(node) {
    if (
        ts.isTypeAliasDeclaration(node) &&
        ts.isUnionTypeNode(node.type)
    ) {
        const name = node.name.text;

        const values = node.type.types
            .filter(
                t =>
                    ts.isLiteralTypeNode(t) &&
                    ts.isStringLiteral(t.literal)
            )
            .map(t => t.literal.text);

        if (values.length > 0) {
            dictionary[name] = values;
        }
    }
}

function processFile(filePath) {
    const program = ts.createProgram([filePath], {
        allowJs: false,
        skipLibCheck: true,
        noResolve: true
    });

    const source = program.getSourceFile(filePath);
    if (!source) {
        console.error("Could not load source file:", filePath);
        return;
    }

    ts.forEachChild(source, extractUnion);
}

for (const file of fs.readdirSync(TYPES_DIR)) {
    if (file.endsWith(".ts")) {
        processFile(path.join(TYPES_DIR, file));
    }
}

const output =
`// AUTO-GENERATED FILE - DO NOT EDIT
export const EnumDictionary = ${JSON.stringify(dictionary, null, 2)} as const;
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, output);

console.log("Generated:", OUTPUT);
