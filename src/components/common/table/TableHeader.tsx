import { t } from 'i18next';

import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import {
  Checkbox,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import { UseEditableTableType } from '@/components/hooks/useEditableTable';
import {
  EDITABLE_TABLE_DISCARD_ALL_BUTTON_CY,
  EDITABLE_TABLE_FILTER_INPUT_CY,
  EDITABLE_TABLE_SAVE_ALL_BUTTON_CY,
  buildEditableSelectAllButtonCy,
} from '@/config/selectors';
import { TEXT_ANALYSIS } from '@/langs/constants';

import { StyledTd, StyledTh } from './styles';
import { CheckBoxState, Column, RowType } from './types';

const computeCheckBoxState = (
  isChecked: boolean,
  isIndeterminate: boolean,
): CheckBoxState => {
  if (isChecked) {
    return CheckBoxState.CHECKED;
  }

  if (isIndeterminate) {
    return CheckBoxState.INDETERMINATE;
  }

  return CheckBoxState.UNCHECKED;
};

type Props<T extends RowType> = {
  columns: Column<T>[];
  isSelectable: boolean;
  isEditable: boolean;

  viewModel: UseEditableTableType<T>;
};

const TableHeader = <T extends RowType>({
  columns,
  isSelectable,
  isEditable,

  viewModel,
}: Props<T>): JSX.Element => (
  <>
    <thead>
      <tr>
        <StyledTd
          colSpan={
            viewModel.isEditing
              ? viewModel.totalColumns - 1
              : viewModel.totalColumns
          }
        >
          <TextField
            data-cy={EDITABLE_TABLE_FILTER_INPUT_CY}
            placeholder={t(
              TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_SEARCH_PLACEHOLDER,
            )}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
            onChange={(event) =>
              viewModel.updateTableFilter(event.target.value)
            }
          />
        </StyledTd>
        {viewModel.isEditing && (
          <StyledTd>
            <Stack direction="row">
              <Tooltip
                title={t(
                  TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_SAVE_ALL_ROWS_TOOLTIP,
                )}
              >
                <IconButton
                  data-cy={EDITABLE_TABLE_SAVE_ALL_BUTTON_CY}
                  disabled={!viewModel.areRowsValid}
                  aria-label="save-all-rows-icon"
                  onClick={() => {
                    if (viewModel.areRowsValid) {
                      viewModel.handleSaveAll();
                    }
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_DISCARD_ALL_ROWS_TOOLTIP,
                )}
              >
                <IconButton
                  data-cy={EDITABLE_TABLE_DISCARD_ALL_BUTTON_CY}
                  aria-label="cancel-all-rows-icon"
                  onClick={viewModel.handleDiscardAll}
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
          <StyledTh>
            <Checkbox
              data-cy={buildEditableSelectAllButtonCy(
                computeCheckBoxState(
                  viewModel.isGlobalChecked,
                  viewModel.isGlobalIndeterminate,
                ),
              )}
              checked={viewModel.isGlobalChecked}
              indeterminate={viewModel.isGlobalIndeterminate}
              onChange={(_e, isChecked) =>
                viewModel.handleGlobalOnChange(isChecked)
              }
            />
          </StyledTh>
        )}
        {columns.map((c) => (
          <StyledTh key={`th-${c.key}`}>{c.displayColumn}</StyledTh>
        ))}
        {isEditable && (
          <StyledTh>
            {t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_ACTIONS_COLUMN)}
          </StyledTh>
        )}
      </tr>
    </thead>
  </>
);

export default TableHeader;
