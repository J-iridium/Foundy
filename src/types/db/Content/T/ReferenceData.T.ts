export interface ReferencesData {
    uri: string;
    label? : string;
    accessedAt?: string; // ISO date: when you fetched/verified this reference
    type?: "documentation" | "external" | "internal";
}
