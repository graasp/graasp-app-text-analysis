import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { Tooltip } from '@mui/material';

type Props = {
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  lastSavedMsg?: string;
};

const ICON_COLOR = '#BBB';

const SyncIcon = ({
  isSuccess,
  isError,
  isLoading,
  lastSavedMsg,
}: Props): JSX.Element => {
  /* TODO: translate  */
  let syncMessage = 'no changes';
  let syncIcon = <CheckCircleOutlineIcon htmlColor={ICON_COLOR} />;

  if (isError) {
    /* TODO: translate  */
    syncMessage = 'an error occured during the synchronization';
    syncIcon = <CloudOffIcon htmlColor={ICON_COLOR} />;
  } else if (isSuccess) {
    /* TODO: translate  */
    syncMessage = `saved ${lastSavedMsg}`;
    syncIcon = <CloudDoneIcon htmlColor="#BBB" />;
  } else if (isLoading) {
    /* TODO: translate  */
    syncMessage = 'synchronizing';
    syncIcon = <CloudSyncIcon htmlColor={ICON_COLOR} />;
  }

  return <Tooltip title={syncMessage}>{syncIcon}</Tooltip>;
};

export default SyncIcon;
