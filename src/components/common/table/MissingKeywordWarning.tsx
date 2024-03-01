import { t } from 'i18next';

import WarningIcon from '@mui/icons-material/Warning';
import {
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';

import { Keyword } from '@/config/appSettingTypes';
import { buildKeywordNotExistWarningCy } from '@/config/selectors';
import { TEXT_ANALYSIS } from '@/langs/constants';
import { isKeywordPresent } from '@/utils/keywords';

import { Row } from './types';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

const MissingKeywordWarning = (
  row: Row<Keyword>,
  text: string,
): JSX.Element | null => {
  if (!isKeywordPresent(text, row.word)) {
    return (
      <HtmlTooltip
        title={
          <>
            <Typography color="inherit">
              {t(TEXT_ANALYSIS.KEYWORDS_NOT_IN_TEXT_TOOLTIP_TITLE)}
            </Typography>
            {t(TEXT_ANALYSIS.KEYWORDS_NOT_IN_TEXT_TOOLTIP_MSG, {
              keyword: row.word,
            })}
          </>
        }
      >
        <WarningIcon
          data-cy={buildKeywordNotExistWarningCy(row.rowId)}
          sx={{ ml: 1, color: '#FFCC00' }}
        />
      </HtmlTooltip>
    );
  }
  return null;
};

export default MissingKeywordWarning;
