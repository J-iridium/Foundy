/**
 * When adding new content using _name_ = ContentOf<"name">
 * Make sure to run the script: generate-modals.cjs
 * This will automatically generate the Modals and ContentSchema for typing efficience and generation of modals.
 * 
 * HOW TO RUN 
 * Command: 
 *      `node scripts/generate-modals.cjs` 
 * OR use npm: 
 *      `npm run generate:modals`
 * 
 * Dictionary import can be found in:
 * /types/generated/Modals.ts
 * /types/generatedContentSchemas.ts 
 * 
 * import type { Modals } from '$types/generated/Modals'
 * import typ { ContentSchemas } from '$types/generated/ContentSchemas'
 */

export type * from './Image.type'
export type * from './Post.type'
export type * from './Product.type'
export type * from './HomePage.type'