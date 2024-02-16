import { t } from 'i18next';

import { toast } from 'react-toastify';

import { Keyword } from '@/config/appSettingTypes';
import { TEXT_ANALYSIS } from '@/langs/constants';
import { isKeywordsEquals } from '@/utils/keywords';

import EditableTable, { Column, Row } from './EditableTable';

const includes = (text: string, search: string): boolean =>
  text.toLowerCase().includes(search.toLowerCase());

type Props = {
  keywords: Keyword[];
  text: string;
  onUpdate: (oldKey: string, newKeyword: Keyword) => void;
  onDeleteSelection: (selectedKeywords: Keyword[]) => void;
};

const keywordIsInFilter = (k: Row<Keyword>, filter: string): boolean =>
  includes(k.word, filter) || includes(k.def, filter);

const KeywordsTable = ({
  keywords,
  text,
  onUpdate,
  onDeleteSelection,
}: Props): JSX.Element => {
  // TODO: translate me
  const columns: Column<Keyword>[] = [
    { key: 'word', displayColumn: 'Keyword' },
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
