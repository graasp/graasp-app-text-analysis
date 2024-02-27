import { t } from 'i18next';

import { useState } from 'react';

import {
  EDITABLE_TABLE_FILTER_NO_RESULT_CY,
  EDITABLE_TABLE_NO_DATA_CY,
  buildEditableTableSelectButtonCy,
} from '@/config/selectors';
import { TEXT_ANALYSIS } from '@/langs/constants';

import { TableActionEvent } from '../common/table/TableActions';
import { Column, Row, RowId, RowType } from '../common/table/types';

export type UseEditableTableType<T extends RowType> = {
  tableFilter: string;
  setTableFilter: (newFilter: string) => void;
  selectedRows: Row<T>[];
  setSelectedRows: React.Dispatch<React.SetStateAction<Row<T>[]>>;
  editingRows: Map<RowId, Row<T>>;
  setEditingRows: React.Dispatch<React.SetStateAction<Map<RowId, Row<T>>>>;
  filteredRows: Row<T>[];
  filteredSelection: Row<T>[];
  totalColumns: number;
  isEditingRow: (rowId: RowId) => boolean;
  isEditing: boolean;
  isGlobalChecked: boolean;
  isGlobalIndeterminate: boolean;
  tableNoResultDataCy: string;
  tableNoResultMessage: string;
  areRowsValid: boolean;
  isRowChecked: (rowId: RowId) => boolean;
  getColValue: (row: Row<T>, col: string) => unknown;
  getRow: (rowId: RowId) => Row<T> | undefined;
  hasMissingMandatoryValue: (row: Row<T>) => boolean;
  isKeysEquals: (r1: RowId, r2: RowId) => boolean;
  rowsInclude: (searchInRows: Row<T>[], rowId: RowId) => boolean;
  addInEditing: (row: Row<T>) => void;
  handleCheckBoxChanged: (isChecked: boolean, rowId: RowId) => void;
  handleDeleteSelection: () => void;
  handleRowChanged: (row: Row<T>, columnKey: string, value: string) => void;
  removeRowFromEditing: (rowId: RowId) => void;
  saveRow: (rowId: RowId) => void;
  handleSaveAll: () => void;
  handleDiscardAll: () => void;
  handleOnEdit: (rowId: RowId) => void;
  handleActionEvents: (rowId: RowId, event: TableActionEvent) => void;
  handleGlobalOnChange: (isChecked: boolean) => void;
  buildTableSelectButtonCy: (rowId: RowId) => string;
};

type UseEditableTableProps<T extends RowType> = {
  columns: Column<T>[];
  rows: Row<T>[];
  isSelectable?: boolean;
  isEditable?: boolean;

  onUpdate: (rowId: string, newRow: Row<T>) => Promise<void>;
  onDeleteSelection: (selection: Row<T>[]) => void;
  rowIsInFilter: (row: Row<T>, filter: string) => boolean;
};

export const useEditableTable = <T extends RowType>({
  rows,
  columns,
  isSelectable,
  isEditable,

  onUpdate,
  onDeleteSelection,
  rowIsInFilter,
}: UseEditableTableProps<T>): UseEditableTableType<T> => {
  const [tableFilter, setTableFilter] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Row<T>[]>([]);
  const [editingRows, setEditingRows] = useState<Map<RowId, Row<T>>>(new Map());

  const filteredRows = rows.filter((r) => rowIsInFilter(r, tableFilter));
  const filteredSelection = selectedRows.filter((r) =>
    rowIsInFilter(r, tableFilter),
  );
  const totalColumns =
    columns.length +
    // add checkbox and actions columns
    (isSelectable ? 1 : 0) +
    (isEditable ? 1 : 0);

  const isEditingRow = (rowId: RowId): boolean => editingRows.has(rowId);

  const isEditing = Boolean(editingRows.size);

  const isGlobalChecked = Boolean(
    filteredSelection.length &&
      filteredSelection.length === filteredRows.length,
  );

  const isGlobalIndeterminate = Boolean(
    filteredSelection.length &&
      filteredSelection.length !== filteredRows.length,
  );

  const isKeysEquals = (r1: RowId, r2: RowId): boolean =>
    r1.toLowerCase() === r2.toLowerCase();

  const rowsInclude = (searchInRows: Row<T>[], rowId: RowId): boolean =>
    searchInRows.find((r) => isKeysEquals(r.rowId, rowId)) !== undefined;

  const getColValue = (row: Row<T>, col: string): unknown =>
    editingRows.get(row.rowId)?.[col] ?? row[col];

  const getRow = (rowId: RowId): Row<T> | undefined =>
    rows.find((r) => isKeysEquals(r.rowId, rowId));

  const hasMissingMandatoryValue = (row: Row<T>): boolean =>
    columns.some((c) => c.optional === false && !getColValue(row, c.key));

  const areRowsValid = !rows.some(hasMissingMandatoryValue);

  const addInEditing = (row: Row<T>): void =>
    setEditingRows((currState) => new Map([...currState, [row.rowId, row]]));

  const handleCheckBoxChanged = (isChecked: boolean, rowId: RowId): void => {
    const rowInSelection = rowsInclude(selectedRows, rowId);
    if (isChecked && !rowInSelection) {
      const row = getRow(rowId);
      if (row) {
        setSelectedRows((currState) => [...currState, row]);
      }
    } else if (!isChecked && rowInSelection) {
      setSelectedRows((currState) =>
        currState.filter((s) => !isKeysEquals(s.rowId, rowId)),
      );
    }
  };

  const handleDeleteSelection = (): void => {
    if (selectedRows.length) {
      setEditingRows((currState) => {
        const newMap = new Map(currState);
        filteredSelection.forEach((k) => newMap.delete(k.rowId));
        return newMap;
      });
      onDeleteSelection(filteredSelection);
      setSelectedRows((currSelection) =>
        currSelection.filter(
          ({ rowId }) => !rowsInclude(filteredSelection, rowId),
        ),
      );
    }
  };

  const updateEditingRow = (rowId: RowId, newRow: Row<T>): void =>
    setEditingRows((currState) => {
      const newMap = new Map(currState);
      newMap.set(rowId, newRow);
      return newMap;
    });

  const handleRowChanged = (
    row: Row<T>,
    columnKey: string,
    value: string,
  ): void => {
    updateEditingRow(row.rowId, {
      ...(editingRows.get(row.rowId) ?? row),
      [columnKey]: value,
    });
  };

  const removeRowFromEditing = (rowId: RowId): void =>
    setEditingRows((currState) => {
      const newMap = new Map(currState);
      newMap.delete(rowId);
      return newMap;
    });

  const saveRow = (rowId: RowId): void => {
    const newRow = editingRows.get(rowId);

    if (newRow) {
      onUpdate(rowId, newRow)
        .then(() => {
          removeRowFromEditing(rowId);
          // remove the update item from the selection because we don't know its new id from this component.
          // TODO: remove this code if the keyword had a unique ID that didn't change after an update.
          setSelectedRows((currSelection) =>
            currSelection.filter(({ rowId: rId }) => !isKeysEquals(rId, rowId)),
          );
        })
        // catch the exception, but there is nothing to do here.
        .catch((e) => e);
    }
  };

  const handleSaveAll = (): void => {
    editingRows.forEach((_, rowId) => {
      if (rowsInclude(filteredRows, rowId)) {
        saveRow(rowId);
      }
    });
  };

  const handleDiscardAll = (): void => {
    editingRows.forEach((_, rowId) => {
      if (rowsInclude(filteredRows, rowId)) {
        removeRowFromEditing(rowId);
      }
    });
  };

  const handleOnEdit = (rowId: RowId): void => {
    if (isEditingRow(rowId)) {
      // Row is already been editingKeywords.
      return;
    }

    const row = getRow(rowId);
    if (row) {
      addInEditing(row);
    }
  };

  const handleActionEvents = (rowId: RowId, event: TableActionEvent): void => {
    switch (event) {
      case TableActionEvent.EDIT:
        handleOnEdit(rowId);
        break;
      case TableActionEvent.DISCARD:
        removeRowFromEditing(rowId);
        break;
      case TableActionEvent.SAVE:
        saveRow(rowId);
        break;
      case TableActionEvent.DELETE:
        removeRowFromEditing(rowId);
        onDeleteSelection(rows.filter((r) => isKeysEquals(r.rowId, rowId)));
        setSelectedRows((currSelection) =>
          currSelection.filter((s) => !isKeysEquals(s.rowId, rowId)),
        );
        break;
      default:
        throw new Error(`TableActionEvent "${event}" unknown.`);
    }
  };

  const handleGlobalOnChange = (isChecked: boolean): void => {
    const newSelection = selectedRows.filter(
      ({ rowId }) => !rowsInclude(filteredSelection, rowId),
    );

    if (isChecked) {
      filteredRows.forEach((r) => newSelection.push(r));
    }
    setSelectedRows(newSelection);
  };

  const tableNoResultDataCy = rows.length
    ? EDITABLE_TABLE_FILTER_NO_RESULT_CY
    : EDITABLE_TABLE_NO_DATA_CY;

  const tableNoResultMessage = rows.length
    ? t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_FILTER_NO_DATA, {
        tableFilter,
      })
    : t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_NO_DATA);

  const isRowChecked = (rowId: RowId): boolean =>
    rowsInclude(selectedRows, rowId);

  const buildTableSelectButtonCy = (rowId: RowId): string =>
    buildEditableTableSelectButtonCy(rowId, isRowChecked(rowId));

  return {
    tableFilter,
    setTableFilter,
    selectedRows,
    setSelectedRows,
    editingRows,
    setEditingRows,
    filteredRows,
    filteredSelection,
    totalColumns,
    isEditingRow,
    isEditing,
    isGlobalChecked,
    isGlobalIndeterminate,
    isKeysEquals,
    isRowChecked,
    rowsInclude,
    getColValue,
    getRow,
    hasMissingMandatoryValue,
    areRowsValid,
    addInEditing,
    handleCheckBoxChanged,
    handleDeleteSelection,
    handleRowChanged,
    removeRowFromEditing,
    saveRow,
    handleSaveAll,
    handleDiscardAll,
    handleOnEdit,
    handleActionEvents,
    handleGlobalOnChange,
    tableNoResultDataCy,
    tableNoResultMessage,
    buildTableSelectButtonCy,
  };
};
