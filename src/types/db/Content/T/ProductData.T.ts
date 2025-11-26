import type { base64 } from "$types/utils/base64.type";

export interface ProductData {
    title: string;
    price: number;
    images: base64[];
    descriptionHtml: string;
    stock: number;
}
  