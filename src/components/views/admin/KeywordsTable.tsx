import { t } from 'i18next';

import { toast } from 'react-toastify';

import WarningIcon from '@mui/icons-material/Warning';
import {
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';

import { Keyword } from '@/config/appSettingTypes';
import { TEXT_ANALYSIS } from '@/langs/constants';
import { isKeywordPresent, isKeywordsEquals } from '@/utils/keywords';

import EditableTable from '../../common/table/EditableTable';
import { Column, Row } from '../../common/table/types';

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

const renderWarningIcon = (
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
        <WarningIcon sx={{ marginLeft: '5px', color: '#FFCC00' }} />
      </HtmlTooltip>
    );
  }
  return null;
};

const includes = (text: string, search: string): boolean =>
  text.toLowerCase().includes(search.toLowerCase());

const keywordIsInFilter = (k: Row<Keyword>, filter: string): boolean =>
  includes(k.word, filter) || includes(k.def, filter);

type Props = {
  keywords: Keyword[];
  text: string;
  onUpdate: (oldKey: string, newKeyword: Keyword) => void;
  onDeleteSelection: (selectedKeywords: Keyword[]) => void;
};

const KeywordsTable = ({
  keywords,
  text,
  onUpdate,
  onDeleteSelection,
}: Props): JSX.Element => {
  // TODO: translate me
  const columns: Column<Keyword>[] = [
    {
      key: 'word',
      displayColumn: 'Keyword',
      renderAfter: (content) => renderWarningIcon(content, text),
    },
    { key: 'def', displayColumn: 'Definition', multiline: true },
  ];

  const rows = keywords.map((k) => ({ rowId: k.word, ...k }));

  const handleSave = (rowId: string, newRow: Row<Keyword>): Promise<void> => {
    if (
      !isKeywordsEquals(rowId, newRow) &&
      keywords.find((k) => isKeywordsEquals(k, newRow))
    ) {
      const alreadyExistsMsg = t(
        TEXT_ANALYSIS.KEYWORD_ALREADY_EXIST_WARNING_MESSAGE,
        {
          keyword: newRow.word.toLowerCase(),
        },
      );

      toast.warning(alreadyExistsMsg);
      return Promise.reject(alreadyExistsMsg);
    }

    onUpdate(rowId, { word: newRow.word, def: newRow.def });
    return Promise.resolve();
  };

  const handleOnDeleteSelection = (selection: Row<Keyword>[]): void =>
    onDeleteSelection(selection.map((r) => ({ word: r.rowId, def: r.def })));

  return (
    <EditableTable
      columns={columns}
      rows={rows}
      onUpdate={handleSave}
      onDeleteSelection={handleOnDeleteSelection}
      rowIsInFilter={keywordIsInFilter}
    />
  );
};

export default KeywordsTable;
