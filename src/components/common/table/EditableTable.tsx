import { Checkbox, Stack, Typography } from '@mui/material';

import { useEditableTable } from '@/components/hooks/useEditableTable';
import { EDITABLE_TABLE_CY, EDITABLE_TABLE_ROW_CY } from '@/config/selectors';

import ReadableTextField from './ReadableTextField';
import TableActions from './TableActions';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import { StyledBox, StyledTable, StyledTd } from './styles';
import { Column, Row, RowType } from './types';

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
  const viewModel = useEditableTable({
    columns,
    rows,
    isSelectable,
    isEditable,

    onUpdate,
    onDeleteSelection,
    rowIsInFilter,
  });

  return (
    <StyledBox>
      <StyledTable data-cy={EDITABLE_TABLE_CY}>
        <TableHeader
          columns={columns}
          isSelectable={isSelectable}
          isEditable={isEditable}
          viewModel={viewModel}
        />
        <tbody>
          {viewModel.filteredRows.length ? (
            viewModel.filteredRows.map((r) => (
              <tr key={r.rowId} data-cy={EDITABLE_TABLE_ROW_CY}>
                {isSelectable && (
                  <StyledTd>
                    <Checkbox
                      data-cy={viewModel.buildTableSelectButtonCy(r.rowId)}
                      onChange={(_e, isChecked) =>
                        viewModel.handleCheckBoxChanged(isChecked, r.rowId)
                      }
                      checked={viewModel.isRowChecked(r.rowId)}
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
                        value={viewModel.getColValue(r, c.key)}
                        size="small"
                        onChange={(value) =>
                          viewModel.handleRowChanged(r, c.key, value)
                        }
                        multiline={c.multiline}
                        readonly={!viewModel.isEditingRow(r.rowId)}
                      />
                      {c.renderAfter?.(r)}
                    </Stack>
                  </StyledTd>
                ))}

                {isEditable && (
                  <StyledTd>
                    <TableActions
                      rowId={r.rowId}
                      isEditing={viewModel.isEditingRow(r.rowId)}
                      isValid={!viewModel.hasMissingMandatoryValue(r)}
                      onEvent={viewModel.handleActionEvents}
                    />
                  </StyledTd>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <StyledTd colSpan={viewModel.totalColumns} padding={3}>
                <Typography data-cy={viewModel.tableNoResultDataCy}>
                  {viewModel.tableNoResultMessage}
                </Typography>
              </StyledTd>
            </tr>
          )}
        </tbody>
        <TableFooter
          isSelectable={isSelectable}
          isEditable={isEditable}
          totalColumns={viewModel.totalColumns}
          numberFilteredSelection={viewModel.filteredSelection.length}
          handleDeleteSelection={viewModel.handleDeleteSelection}
        />
      </StyledTable>
    </StyledBox>
  );
};

export default EditableTable;
