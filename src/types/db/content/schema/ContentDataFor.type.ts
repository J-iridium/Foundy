import type { ContentType } from "../../enums";
import type { ContentSchemas } from "../../../generated/ContentSchemas"

export type ContentDataFor<T extends ContentType> = (typeof ContentSchemas)[T];