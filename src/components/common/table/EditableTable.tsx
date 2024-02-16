import { useState } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';

import ReadableTextField from './ReadableTextField';
import TableActions, { TableActionEvent } from './TableActions';

const StyledBox = styled(Box)({
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #dddddd',
  overflowY: 'auto',
});

const StyledTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid #dddddd',
  overflowY: 'auto',
});

const StyledTh = styled('th')({
  border: '1px solid #dddddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
});

const StyledTd = styled('td')({
  border: '1px solid #dddddd',
  padding: '8px',
  textAlign: 'left',
});

// An alias to better represent the value of the string.
type RowId = string;
type RowType = { [key: string]: string };

type RowKey<T extends RowType> = Extract<keyof T, string>;
export type Column<T extends RowType> = {
  key: RowKey<T>;
  displayColumn: string;
  multiline?: boolean;
};
export type Row<T extends RowType> = { rowId: RowId } & T;

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

  const getColValue = (row: Row<T>, col: string): string =>
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
      <StyledTable>
        <thead>
          <tr>
            <StyledTd
              colSpan={editingRows.size ? totalColumns - 1 : totalColumns}
            >
              <TextField
                // TODO: translate me
                placeholder="Search in the table"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
                onChange={(event) => setFilter(event.target.value)}
              />
            </StyledTd>
            {Boolean(editingRows.size) && (
              <StyledTd>
                <Stack direction="row">
                  {/* TODO: translate me too */}
                  <Tooltip title="Save all the modifications">
                    <IconButton
                      aria-label="save-all-rows-icon"
                      onClick={handleSaveAll}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  {/* TODO: translate me */}
                  <Tooltip title="Discard all the modifications">
                    <IconButton
                      aria-label="cancel-all-rows-icon"
                      onClick={handleDiscardAll}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </StyledTd>
            )}
          </tr>
        </thead>
        <thead>
          <tr>
            {isSelectable && (
              <StyledTh style={{ width: '10px' }}>
                <Checkbox
                  checked={isGlobalChecked}
                  indeterminate={isGlobalIndeterminate}
                  onChange={(_e, isChecked) => handleGlobalOnChange(isChecked)}
                />
              </StyledTh>
            )}
            {/* TODO: translate  */}
            {columns.map((c) => (
              <StyledTh key={`th-${c.key}`}>{c.displayColumn}</StyledTh>
            ))}
            {isEditable && (
              <StyledTh style={{ width: '10px' }}>
                {/* TODO: translates me  */}
                Actions
              </StyledTh>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredRows.length ? (
            filteredRows.map((r) => (
              <tr key={r.rowId}>
                {isSelectable && (
                  // TODO: don't use style
                  <StyledTd style={{ maxWidth: '10px' }}>
                    <Checkbox
                      onChange={(_e, isChecked) =>
                        handleCheckBoxChanged(isChecked, r.rowId)
                      }
                      checked={rowsInclude(selected, r.rowId)}
                    />
                  </StyledTd>
                )}

                {columns.map((c) => (
                  // TODO: don't use style
                  <StyledTd
                    key={`td-${c.key}`}
                    style={{ width: `${100 / columns.length}%` }}
                  >
                    <ReadableTextField
                      value={getColValue(r, c.key.toString())}
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
              <td colSpan={4}>
                {/* TODO: translate me */}
                <Box padding={2}>
                  <Typography>
                    {!rows.length
                      ? 'There is no data for now.'
                      : `No data found for "${filter}".`}
                  </Typography>
                </Box>
              </td>
            </tr>
          )}
        </tbody>
        {isSelectable && isEditable && (
          <tfoot>
            <tr>
              <td colSpan={4}>
                <Box padding={1}>
                  <Button
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    onClick={handleDeleteSelection}
                    disabled={!filteredSelection.length}
                  >
                    {/* TODO: translate me */}
                    Delete selection ({filteredSelection.length})
                  </Button>
                </Box>
              </td>
            </tr>
          </tfoot>
        )}
      </StyledTable>
    </StyledBox>
  );
};

export default EditableTable;
