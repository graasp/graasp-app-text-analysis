import { useTranslation } from 'react-i18next';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { Tooltip } from '@mui/material';

import { TEXT_ANALYSIS } from '@/langs/constants';

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
  const { t } = useTranslation();

  switch (true) {
    case isLoading:
      return (
        <Tooltip title={t(TEXT_ANALYSIS.PLAYER_SYNC_ICON_LOADING_LABEL)}>
          <CloudSyncIcon htmlColor={ICON_COLOR} />
        </Tooltip>
      );
    case isSuccess:
      return (
        <Tooltip
          title={t(TEXT_ANALYSIS.PLAYER_SYNC_ICON_SAVED_LABEL, {
            time_ago: lastSavedMsg,
          })}
        >
          <CloudDoneIcon htmlColor={ICON_COLOR} />
        </Tooltip>
      );
    case isError:
      return (
        <Tooltip title={t(TEXT_ANALYSIS.PLAYER_SYNC_ICON_ERROR_LABEL)}>
          <CloudOffIcon color="error" />
        </Tooltip>
      );
    default: {
      return (
        <Tooltip title={t(TEXT_ANALYSIS.PLAYER_SYNC_ICON_NO_CHANGES_LABEL)}>
          <CheckCircleOutlineIcon htmlColor={ICON_COLOR} />
        </Tooltip>
      );
    }
  }
};

export default SyncIcon;
