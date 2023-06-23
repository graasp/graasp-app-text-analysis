import { useTranslation } from 'react-i18next';

import { useLocalContext } from '@graasp/apps-query-client';

import Alert from '@mui/material/Alert';

const PublicAlert = (): JSX.Element | null => {
  const { t } = useTranslation();

  const context = useLocalContext();

  // does not show banner if user exists
  if (context?.memberId) {
    return null;
  }

  return (
    <Alert severity="error">
      {t('You are not authenticated. You cannot save any data')}
    </Alert>
  );
};

export default PublicAlert;
