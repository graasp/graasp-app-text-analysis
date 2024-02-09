import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { IconButton, Tooltip } from '@mui/material';

type Props = {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  lastSavedMsg?: string;
};

export const SyncIcon = ({
  isSuccess,
  isError,
  isLoading,
  lastSavedMsg,
}: Props): JSX.Element => {
  /* TODO: translate  */
  let syncMessage = 'no changes';
  let syncIcon = (
    <IconButton aria-label="no-changes" color="info">
      <CheckCircleOutlineIcon />
    </IconButton>
  );

  if (isError) {
    /* TODO: translate  */
    syncMessage = 'an error occured during the synchronization';
    syncIcon = (
      <IconButton aria-label="sync-error" color="error">
        <CloudOffIcon />
      </IconButton>
    );
  } else if (isSuccess) {
    /* TODO: translate  */
    syncMessage = `saved ${lastSavedMsg}`;
    syncIcon = (
      <IconButton aria-label="changes-saved" color="success">
        <CloudDoneIcon />
      </IconButton>
    );
  } else if (isLoading) {
    /* TODO: translate  */
    syncMessage = 'synchronizing';
    syncIcon = (
      <IconButton aria-label="sync" color="primary">
        <CloudSyncIcon />
      </IconButton>
    );
  }

  return <Tooltip title={syncMessage}>{syncIcon}</Tooltip>;
};

export default SyncIcon;
