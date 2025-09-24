export type Column<T> = {
  accessor: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

export type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};
