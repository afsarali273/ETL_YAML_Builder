export type DBType = "mssql" | "mysql" | "odbc" | "db2";

export interface DBConfig {
    type: DBType;
    dbServer?: string;
    table?: string;
    database?: string;
    schema?: string;
}

export interface RowCountValidation {
    type: "row_count";
    name: string;
    enabled: boolean;
    tolerance?: number;
}

export interface RowCompareValidation {
    type: "row_compare";
    name: string;
    enabled: boolean;
    key_columns: string[];          // required
    compare_columns?: string[];     // [] => all non-key
    ignore_case?: boolean;
    trim_whitespace?: boolean;
    null_equals_blank?: boolean;
    allow_duplicate_keys?: boolean;
    log_duplicates?: boolean;
    max_mismatches?: number;
    stop_on_first_mismatch?: boolean;
    exclude_columns?: string[];
    include_only_columns?: string[];
}

export interface ColumnCountValidation {
    type: "column_count";
    name: string;
    enabled: boolean;
    targetCount?: number;
}

export interface NullCheckValidation {
    type: "null_check";
    name: string;
    enabled: boolean;
    columns: string[];
    threshold?: number;
    fail_on_any?: boolean;
    scope?: "source" | "target" | "both";
}

export interface ColValueCheckValidation {
    type: "col_value_check";
    name: string;
    enabled: boolean;
    columns: string[];
    expected_col_value?: string;
    sql?: string;
    scope?: "source" | "target" | "both";
}

export interface DuplicateCheckValidation {
    type: "duplicate_check";
    name: string;
    enabled: boolean;
    columns: string[];
    group_by?: string[];
    threshold?: number;
    fail_on_any?: boolean;
    scope?: "source" | "target" | "both";
    ignore_case?: boolean;
    trim_whitespace?: boolean;
}

export type Validation =
    | RowCountValidation
    | RowCompareValidation
    | ColumnCountValidation
    | NullCheckValidation
    | ColValueCheckValidation
    | DuplicateCheckValidation;

export interface JobConfig {
    job_name: string;
    description?: string;
    owner?: string;
    source: DBConfig;
    target: DBConfig;
    validations: Validation[];
}
