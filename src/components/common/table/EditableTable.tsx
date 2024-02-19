import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox, Stack, Typography } from '@mui/material';

import {
  EDITABLE_TABLE_CY,
  EDITABLE_TABLE_FILTER_NO_RESULT_CY,
  EDITABLE_TABLE_NO_DATA_CY,
  buildEditableTableSelectButtonCy,
} from '@/config/selectors';
import { TEXT_ANALYSIS } from '@/langs/constants';

import ReadableTextField from './ReadableTextField';
import TableActions, { TableActionEvent } from './TableActions';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import { StyledBox, StyledTable, StyledTd } from './styles';
import { Column, Row, RowId, RowType } from './types';

const isKeysEquals = (r1: RowId, r2: RowId): boolean =>
  r1.toLowerCase() === r2.toLowerCase();

const rowsInclude = <T extends RowType>(
  rows: Row<T>[],
  rowId: RowId,
): boolean => rows.find((r) => isKeysEquals(r.rowId, rowId)) !== undefined;

type Props<T extends RowType> = {
  columns: Column<T>[];
  rows: Row<T>[];
  isSelectable?: boolean;
  isEditable?: boolean;

  onUpdate: (rowId: string, newRow: Row<T>) => Promise<void>;
  onDeleteSelection: (selection: Row<T>[]) => void;
  rowIsInFilter: (row: Row<T>, filter: string) => boolean;
};

const EditableTable = <T extends RowType>({
  columns,
  rows,
  isSelectable = true,
  isEditable = true,

  onUpdate,
  onDeleteSelection,
  rowIsInFilter,
}: Props<T>): JSX.Element => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState<Row<T>[]>([]);
  const [editingRows, setEditingRows] = useState<Map<RowId, Row<T>>>(new Map());

  const filteredRows = rows.filter((r) => rowIsInFilter(r, filter));
  const filteredSelection = selected.filter((r) => rowIsInFilter(r, filter));
  const totalColumns =
    columns.length +
    // add checkbox and actions columns
    (isSelectable ? 1 : 0) +
    (isEditable ? 1 : 0);

  const isEditing = (rowId: RowId): boolean => editingRows.has(rowId);

  const isGlobalChecked = Boolean(
    filteredSelection.length &&
      filteredSelection.length === filteredRows.length,
  );

  const isGlobalIndeterminate = Boolean(
    filteredSelection.length &&
      filteredSelection.length !== filteredRows.length,
  );

  const getColValue = (row: Row<T>, col: string): unknown =>
    editingRows.get(row.rowId)?.[col] ?? row[col];

  const getRow = (rowId: RowId): Row<T> | undefined =>
    rows.find((r) => isKeysEquals(r.rowId, rowId));

  const addInEditing = (row: Row<T>): void =>
    setEditingRows((currState) => new Map([...currState, [row.rowId, row]]));

  const handleCheckBoxChanged = (isChecked: boolean, rowId: RowId): void => {
    const rowInSelection = rowsInclude(selected, rowId);
    if (isChecked && !rowInSelection) {
      const row = getRow(rowId);
      if (row) {
        setSelected((currState) => [...currState, row]);
      }
    } else if (!isChecked && rowInSelection) {
      setSelected((currState) =>
        currState.filter((s) => !isKeysEquals(s.rowId, rowId)),
      );
    }
  };

  const handleDeleteSelection = (): void => {
    if (selected.length) {
      setEditingRows((currState) => {
        const newMap = new Map(currState);
        filteredSelection.forEach((k) => newMap.delete(k.rowId));
        return newMap;
      });
      onDeleteSelection(filteredSelection);
      setSelected((currSelection) =>
        currSelection.filter(
          ({ rowId }) => !rowsInclude(filteredSelection, rowId),
        ),
      );
    }
  };

  const handleRowChanged = (rowId: RowId, newRow: Row<T>): void =>
    setEditingRows((currState) => {
      const newMap = new Map(currState);
      newMap.set(rowId, newRow);
      return newMap;
    });

  const removeRowFromEditing = (rowId: RowId): void =>
    setEditingRows((currState) => {
      const newMap = new Map(currState);
      newMap.delete(rowId);
      return newMap;
    });

  const saveRow = (rowId: RowId): void => {
    const newRow = editingRows.get(rowId);

    if (newRow) {
      onUpdate(rowId, newRow).then(() => {
        removeRowFromEditing(rowId);
      });

      // remove the update item from the selection because we don't know its new id from this component.
      // TODO: remove this code if the keyword had a unique ID that didn't change after an update.
      setSelected((currSelection) =>
        currSelection.filter(({ rowId: rId }) => !isKeysEquals(rId, rowId)),
      );
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
    if (isEditing(rowId)) {
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
        setSelected((currSelection) =>
          currSelection.filter((s) => !isKeysEquals(s.rowId, rowId)),
        );
        break;
      default:
        throw new Error(`TableActionEvent "${event}" unknown.`);
    }
  };

  const handleGlobalOnChange = (isChecked: boolean): void => {
    const newSelection = selected.filter(
      ({ rowId }) => !rowsInclude(filteredSelection, rowId),
    );

    if (isChecked) {
      filteredRows.forEach((r) => newSelection.push(r));
    }
    setSelected(newSelection);
  };

  return (
    <StyledBox>
      <StyledTable data-cy={EDITABLE_TABLE_CY}>
        <TableHeader
          isEditing={Boolean(editingRows.size)}
          isSelectable={isSelectable}
          isEditable={isEditable}
          totalColumns={totalColumns}
          isGlobalChecked={isGlobalChecked}
          isGlobalIndeterminate={isGlobalIndeterminate}
          columns={columns}
          onSaveAll={handleSaveAll}
          onDiscardAll={handleDiscardAll}
          onFilterChanged={setFilter}
          onGlobalCheckChanged={handleGlobalOnChange}
        />
        <tbody>
          {filteredRows.length ? (
            filteredRows.map((r) => (
              <tr key={r.rowId}>
                {isSelectable && (
                  <StyledTd>
                    <Checkbox
                      data-cy={buildEditableTableSelectButtonCy(
                        r.rowId,
                        rowsInclude(selected, r.rowId),
                      )}
                      onChange={(_e, isChecked) =>
                        handleCheckBoxChanged(isChecked, r.rowId)
                      }
                      checked={rowsInclude(selected, r.rowId)}
                    />
                  </StyledTd>
                )}

                {columns.map((c) => (
                  <StyledTd
                    key={`td-${c.key}`}
                    width={`${100 / columns.length}%`}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ReadableTextField
                        rowId={r.rowId}
                        fieldName={c.key}
                        value={getColValue(r, c.key)}
                        size="small"
                        onChange={(value) =>
                          handleRowChanged(r.rowId, {
                            ...(editingRows.get(r.rowId) ?? r),
                            [c.key.toString()]: value,
                          })
                        }
                        multiline={c.multiline}
                        readonly={!isEditing(r.rowId)}
                      />
                      {c.renderAfter?.(r)}
                    </Stack>
                  </StyledTd>
                ))}

                {isEditable && (
                  <StyledTd>
                    <TableActions
                      rowId={r.rowId}
                      isEditing={isEditing(r.rowId)}
                      onEvent={handleActionEvents}
                    />
                  </StyledTd>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <StyledTd colSpan={totalColumns} padding={3}>
                <Typography
                  data-cy={
                    rows.length
                      ? EDITABLE_TABLE_FILTER_NO_RESULT_CY
                      : EDITABLE_TABLE_NO_DATA_CY
                  }
                >
                  {rows.length
                    ? t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_FILTER_NO_DATA, {
                        filter,
                      })
                    : t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_NO_DATA)}
                </Typography>
              </StyledTd>
            </tr>
          )}
        </tbody>
        <TableFooter
          isSelectable={isSelectable}
          isEditable={isEditable}
          totalColumns={totalColumns}
          numberFilteredSelection={filteredSelection.length}
          handleDeleteSelection={handleDeleteSelection}
        />
      </StyledTable>
    </StyledBox>
  );
};

export default EditableTable;
