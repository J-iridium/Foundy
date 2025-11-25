// contentSchemas.ts
import type { HomePageData, ProductData, PostData, ImageData } from "./T";

export const ContentSchemas = {
  homepage: {} as HomePageData,
  product: {} as ProductData,
  post: {} as PostData,
  media: {} as ImageData,
} as const;
