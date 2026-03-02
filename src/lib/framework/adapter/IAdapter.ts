import type { AdapterSchema } from "./AdapterSchema";

export interface IAdapter {
    // Identity 
    readonly name: string;
    readonly version: string;

    // Dependency declaration
    readonly requires: string[]; 

    // Schema declarations
    readonly schema: AdapterSchema;

    // Lifecycle
    initialize(): Promise<void>;
    healthCheck(): Promise<Boolean>;
    shutdown(): Promise<void>;

    // Services Exposed
    services(): Record<string, unknown>
}
