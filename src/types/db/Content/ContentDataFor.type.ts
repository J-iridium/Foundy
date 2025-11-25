import type { ContentType } from "../Enums";
import type { ContentSchemas } from "./ContentSchema.type"

export type ContentDataFor<T extends ContentType> = (typeof ContentSchemas)[T];