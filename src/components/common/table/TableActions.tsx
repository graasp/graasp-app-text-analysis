import { t } from 'i18next';

import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton, Stack, Tooltip } from '@mui/material';

import { TEXT_ANALYSIS } from '@/langs/constants';

export enum TableActionEvent {
  EDIT = 'edit',
  DISCARD = 'discard',
  SAVE = 'save',
  DELETE = 'delete',
}

type Props = {
  isEditing: boolean;
  rowId: string;
  onEvent: (rowId: string, event: TableActionEvent) => void;
};

const TableActions = ({ isEditing, rowId, onEvent }: Props): JSX.Element => {
  const handleEvent = (event: TableActionEvent): void => onEvent(rowId, event);

  return (
    <Stack direction="row">
      {isEditing ? (
        <>
          <Tooltip
            title={t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_SAVE_ROW_TOOLTIP)}
          >
            <IconButton
              aria-label="save-row-icon"
              color="success"
              onClick={() => handleEvent(TableActionEvent.SAVE)}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_DISCARD_ROW_TOOLTIP)}
          >
            <IconButton
              aria-label="cancel-row-icon"
              color="error"
              onClick={() => handleEvent(TableActionEvent.DISCARD)}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip
            title={t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_EDIT_ROW_TOOLTIP)}
          >
            <IconButton
              aria-label="edit-row-icon"
              onClick={() => handleEvent(TableActionEvent.EDIT)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_DELETE_ROW_TOOLTIP)}
          >
            <IconButton
              aria-label="delete-row-icon"
              onClick={() => handleEvent(TableActionEvent.DELETE)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Stack>
  );
};

export default TableActions;
