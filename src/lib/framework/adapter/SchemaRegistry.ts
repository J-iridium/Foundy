import type { TableDefinition } from "./AdapterSchema";
import type { IAdapter } from "./IAdapter";

class SchemaRegistry {
    register(adapter : IAdapter) : void {

    }

    getSchema() : Record<string, TableDefinition> {
        return {}
    }

}