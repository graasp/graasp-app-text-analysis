// An alias to better represent the value of the string.
export type RowId = string;

export type RowType = { [key: string]: unknown };

export type Row<T extends RowType> = { rowId: RowId } & T;

export type RowKey<T extends RowType> = Extract<keyof T, string>;

export type Column<T extends RowType> = {
  key: RowKey<T>;
  displayColumn: string;
  multiline?: boolean;
  renderAfter?: (row: Row<T>) => JSX.Element | null;
};
