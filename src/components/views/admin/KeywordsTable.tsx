import { t } from 'i18next';

import { toast } from 'react-toastify';

import MissingKeywordWarning from '@/components/common/table/MissingKeywordWarning';
import { Keyword } from '@/config/appSettingTypes';
import { TEXT_ANALYSIS } from '@/langs/constants';
import { areKeywordsEquals } from '@/utils/keywords';

import EditableTable from '../../common/table/EditableTable';
import { Column, Row } from '../../common/table/types';

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
  const columns: Column<Keyword>[] = [
    {
      key: 'word',
      displayColumn: t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_KEYWORD_COLUMN),
      renderAfter: (content) => MissingKeywordWarning(content, text),
      optional: false,
    },
    {
      key: 'def',
      displayColumn: t(TEXT_ANALYSIS.BUILDER_KEYWORDS_TABLE_DEFINITION_COLUMN),
      multiline: true,
    },
  ];

  const rows = keywords.map((k) => ({ rowId: k.word, ...k }));

  const handleSave = (rowId: string, newRow: Row<Keyword>): Promise<void> => {
    if (
      !areKeywordsEquals(rowId, newRow) &&
      keywords.find((k) => areKeywordsEquals(k, newRow))
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
