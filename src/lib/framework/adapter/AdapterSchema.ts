export interface AdapterSchema {

  // Tables this adapter creates and owns
  tables?: TableDefinition[];

  // Columns this adapter adds to another adapter's table
  extensions?: TableExtension[];
}

export interface TableDefinition {
  name:       string;
  columns:    ColumnDefinition[];
  indexes?:   IndexDefinition[];
  timestamps?: boolean;  // auto-adds created_at, updated_at, deleted_at
}

export interface TableExtension {
  table:   string;            // must already exist (owned by a dependency adapter)
  columns: ColumnDefinition[];
}

export interface ColumnDefinition {
  name:        string;
  type:        ColumnType;
  primaryKey?: boolean;
  notNull?:    boolean;
  unique?:     boolean;
  default?:    unknown;
  references?: { table: string; column: string; onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' };
  enumValues?: string[];      // only when type is 'enum'
  length?:     number;        // only when type is 'varchar'
  arrayOf?:    ColumnType;    // only when type is 'array'
}

export interface IndexDefinition {
  columns:  string[];
  unique?:  boolean;
  name?:    string;           // auto-generated if omitted
}

export type ColumnType =
  | 'uuid'
  | 'varchar'
  | 'text'
  | 'boolean'
  | 'integer'
  | 'bigint'
  | 'timestamp'
  | 'jsonb'
  | 'enum'
  | 'array';