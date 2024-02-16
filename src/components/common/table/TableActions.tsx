import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton, Stack, Tooltip } from '@mui/material';

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
          {/* TODO: translate me too */}
          <Tooltip title="Save the modifications">
            <IconButton
              aria-label="save-row-icon"
              color="success"
              onClick={() => handleEvent(TableActionEvent.SAVE)}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          {/* TODO: translate me */}
          <Tooltip title="Discard the modifications">
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
          {/* TODO: translate me */}
          <Tooltip title="Edit the row">
            <IconButton
              aria-label="edit-row-icon"
              onClick={() => handleEvent(TableActionEvent.EDIT)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {/* TODO: translate me */}
          <Tooltip title="Delete the row">
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
