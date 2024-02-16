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

import { TEXT_ANALYSIS } from '@/langs/constants';

import { StyledTd, StyledTh } from './styles';
import { Column, RowType } from './types';

type Props<T extends RowType> = {
  isEditing: boolean;
  isSelectable: boolean;
  isEditable: boolean;
  totalColumns: number;
  isGlobalChecked: boolean;
  isGlobalIndeterminate: boolean;
  columns: Column<T>[];

  onSaveAll: () => void;
  onDiscardAll: () => void;
  onFilterChanged: (filter: string) => void;
  onGlobalCheckChanged: (isChecked: boolean) => void;
};

const TableHeader = <T extends RowType>({
  isEditing,
  isSelectable,
  isEditable,
  totalColumns,
  isGlobalChecked,
  isGlobalIndeterminate,
  columns,

  onSaveAll,
  onDiscardAll,
  onFilterChanged,
  onGlobalCheckChanged,
}: Props<T>): JSX.Element => (
  <>
    <thead>
      <tr>
        <StyledTd colSpan={isEditing ? totalColumns - 1 : totalColumns}>
          <TextField
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
            onChange={(event) => onFilterChanged(event.target.value)}
          />
        </StyledTd>
        {isEditing && (
          <StyledTd>
            <Stack direction="row">
              <Tooltip
                title={t(
                  TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_SAVE_ALL_ROWS_TOOLTIP,
                )}
              >
                <IconButton aria-label="save-all-rows-icon" onClick={onSaveAll}>
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_DISCARD_ALL_ROWS_TOOLTIP,
                )}
              >
                <IconButton
                  aria-label="cancel-all-rows-icon"
                  onClick={onDiscardAll}
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
              checked={isGlobalChecked}
              indeterminate={isGlobalIndeterminate}
              onChange={(_e, isChecked) => onGlobalCheckChanged(isChecked)}
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
