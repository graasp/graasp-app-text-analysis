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
  switch (true) {
    case isLoading:
      /* TODO: translate  */
      return (
        <Tooltip title="synchronizing">
          <CloudSyncIcon htmlColor={ICON_COLOR} />
        </Tooltip>
      );
    case isSuccess:
      /* TODO: translate  */
      return (
        <Tooltip title={`saved ${lastSavedMsg}`}>
          <CloudDoneIcon htmlColor={ICON_COLOR} />
        </Tooltip>
      );
    case isError:
      /* TODO: translate  */
      return (
        <Tooltip title="an error occured during the synchronization">
          <CloudOffIcon color="error" />
        </Tooltip>
      );
    default: {
      return (
        <Tooltip title="no changes">
          <CheckCircleOutlineIcon htmlColor={ICON_COLOR} />
        </Tooltip>
      );
    }
  }
};

export default SyncIcon;
