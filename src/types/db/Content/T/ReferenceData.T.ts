import type { ReferenceType } from "$types/db/enums/ReferenceType.type";

export interface ReferenceData {
    uri: string;
    label? : string;
    accessedAt?: string; // ISO date: when you fetched/verified this reference
    type?: ReferenceType; //no
}
