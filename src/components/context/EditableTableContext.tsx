import React, {
  FC,
  PropsWithChildren,
  ReactNode,
  createContext,
  useMemo,
  useState,
} from 'react';

import { Column, Row, RowId, RowType } from '../common/table/types';

type EditableTableContextType<T extends RowType> = {
  isEditing: boolean;
  isSelectable: boolean;
  isEditable: boolean;
  isValid: boolean;
  totalColumns: number;
  isGlobalChecked: boolean;
  isGlobalIndeterminate: boolean;
  columns: Column<T>[];

  selected: Row<T>[];
  filter: string;
  setFilter: (filter: string) => void;
};

// Create the context
const createTableContext = <T extends RowType>(): React.Context<
  EditableTableContextType<T>
> =>
  createContext<EditableTableContextType<T>>({
    isEditing: false,
    isEditable: false,
    isValid: false,
    isSelectable: false,
    isGlobalChecked: false,
    isGlobalIndeterminate: false,
    totalColumns: 0,
    columns: [],

    selected: [],
    filter: 'Not init yet...',
    setFilter: () => console.error('oup'),
  });

const contexts = new Map<string, EditableTableContextType<any>>();

// Provider component to expose context values
export const TableProvider: FC<PropsWithChildren> = <T extends RowType>({
  children,
}: {
  children?: ReactNode;
}) => {
  const [filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState<Row<T>[]>([]);
  const [editingRows, setEditingRows] = useState<Map<RowId, Row<T>>>(new Map());

  // State related to editing
  const [isEditing, setIsEditing] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // State related to selection
  const [isSelectable, setIsSelectable] = useState(false);
  const [isGlobalChecked, setIsGlobalChecked] = useState(false);
  const [isGlobalIndeterminate, setIsGlobalIndeterminate] = useState(false);

  // State related to columns and rows
  const [columns, setColumns] = useState<Column<T>[]>([]);
  const [rows, setRows] = useState<Row<T>[]>([]);

  const state = useMemo(
    () => ({
      isEditing,
      isEditable,
      isValid,
      isSelectable,
      isGlobalChecked,
      isGlobalIndeterminate,

      filter,
      selected,
      editingRows,

      totalColumns: 0,

      columns,
      rows,
      setFilter,
    }),
    [
      columns,
      editingRows,
      filter,
      isEditable,
      isEditing,
      isGlobalChecked,
      isGlobalIndeterminate,
      isSelectable,
      isValid,
      rows,
      selected,
    ],
  );

  const TableContext = createTableContext<T>();

  return (
    <TableContext.Provider value={state}>{children}</TableContext.Provider>
  );
};

// Hook to access context values
export const useEditableTableContext = <
  T extends RowType,
>(): EditableTableContextType<T> => React.useContext(createTableContext<T>());
