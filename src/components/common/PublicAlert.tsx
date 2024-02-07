import { useLocalContext } from '@graasp/apps-query-client';

import Alert from '@mui/material/Alert';

import { useTextAnalysisTranslation } from '@/config/i18n';
import { TEXT_ANALYSIS } from '@/langs/constants';

const PublicAlert = (): JSX.Element | null => {
  const { t } = useTextAnalysisTranslation();

  const context = useLocalContext();

  // does not show banner if user exists
  if (context?.memberId) {
    return null;
  }

  return (
    <Alert severity="error">
      {t(TEXT_ANALYSIS.PUBLIC_ALERT_NOT_AUTHENTICATED)}
    </Alert>
  );
};

export default PublicAlert;
