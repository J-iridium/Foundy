/**
 * When adding new enums using _name_ = "" | ""
 * Make sure to run the script: generate-union-enums.cjs
 * This will automatically generate the dictionary again with the newly added enum
 * 
 * HOW TO RUN 
 * Command: 
 *      `node scripts/generate-union-enums.cjs` 
 * OR use npm: 
 *      `npm run generate:enums`
 * 
 * Dictionary import can be found in:
 * /types/generated/EnumDictionary.ts 
 * 
 * import { EnumDictionary } from '$types/generated/EnumDictionary'
 */

export type * from "./ContentType.types";
export type * from "./Device.type";
export type * from "./Event.type";
export type * from "./Plan.types";
export type * from "./Roles.type";
export type * from "./Status.type";
export type * from "./Permissions.type"
export type * from "./ReferenceType.type"

