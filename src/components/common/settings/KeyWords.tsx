import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { Alert, Box, Stack, TextField } from '@mui/material';

import { TEXT_ANALYSIS } from '@/langs/constants';
import { includes } from '@/utils/keywords';

import { Keyword } from '../../../config/appSettingTypes';
import {
  ADD_KEYWORD_BUTTON_CY,
  ENTER_DEFINITION_FIELD_CY,
  ENTER_KEYWORD_FIELD_CY,
} from '../../../config/selectors';
import { DEFAULT_IN_SECTION_SPACING } from '../../../config/stylingConstants';
import KeywordsTable from '../../views/admin/KeywordsTable';
import GraaspButton from './GraaspButton';

type Prop = {
  textStudents: string;
  chatbotEnabled: boolean;
  keywords: Keyword[];
  onChange: (keywords: Keyword[]) => void;
};

const KeyWords: FC<Prop> = ({
  keywords,
  textStudents,
  chatbotEnabled,
  onChange,
}) => {
  const { t } = useTranslation();
  const defaultKeywordDef = { word: '', def: '' };
  const [keywordDef, setKeywordDef] = useState<Keyword>(defaultKeywordDef);

  // This temporary storage for keywords is necessary to handle multiple saves.
  // Without it, subsequent saves could overwrite previous changes
  // as the parent component's keywords state might not update in time.
  // Using keywords.map directly would not account for unsaved changes.
  const pendingKeywordsRef = useRef<Keyword[]>(keywords);

  // Effect to synchronize temporary storage with the latest keywords state.
  useEffect(() => {
    pendingKeywordsRef.current = keywords;
  }, [keywords]);

  const updateKeywordDefinition = (
    key: keyof Keyword,
    target: { value: string },
  ): void => {
    setKeywordDef({
      ...keywordDef,
      [key]: target.value,
    });
  };

  const handleOnChanges = (newDictionary: Keyword[]): void =>
    onChange(newDictionary);

  const handleClickAdd = (): void => {
    const wordToLowerCase = keywordDef.word.toLocaleLowerCase();
    const newKeyword = { word: wordToLowerCase, def: keywordDef.def ?? '' };

    if (keywords.some((k) => k.word === wordToLowerCase)) {
      toast.warning(
        t(TEXT_ANALYSIS.KEYWORD_ALREADY_EXIST_WARNING_MESSAGE, {
          keyword: wordToLowerCase,
        }),
      );
      return;
    }

    if (wordToLowerCase !== '') {
      handleOnChanges([...keywords, newKeyword]);
    }
    setKeywordDef(defaultKeywordDef);
  };

  const handleDelete = (deletedKeywords: Keyword[]): void =>
    handleOnChanges(keywords.filter((k) => !includes(deletedKeywords, k)));

  return (
    <Stack spacing={DEFAULT_IN_SECTION_SPACING}>
      {chatbotEnabled && (
        <Alert severity="info">
          {t(TEXT_ANALYSIS.KEYWORDS_INFO_ALERT_CHATBOT_ENABLED)}
        </Alert>
      )}
      <Box
        component="span"
        justifyContent="space-between"
        display="flex"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        rowGap={DEFAULT_IN_SECTION_SPACING}
        columnGap={2}
      >
        <TextField
          data-cy={ENTER_KEYWORD_FIELD_CY}
          label="Enter the keyword"
          fullWidth
          value={keywordDef.word}
          onChange={(e) => updateKeywordDefinition('word', e.target)}
        />
        <TextField
          data-cy={ENTER_DEFINITION_FIELD_CY}
          label="Enter the keyword's definition"
          fullWidth
          value={keywordDef.def}
          onChange={(e) => updateKeywordDefinition('def', e.target)}
        />
        <Box alignSelf={{ xs: 'flex-end', sm: 'auto' }}>
          <GraaspButton
            buttonDataCy={ADD_KEYWORD_BUTTON_CY}
            handleOnClick={handleClickAdd}
            disabled={!keywordDef.word}
            minHeight="55px"
            text="Add"
          />
        </Box>
      </Box>
      <KeywordsTable
        keywords={keywords}
        text={textStudents}
        onUpdate={(oldKey, newKeyword) => {
          // Update the temporary storage with the new keyword.
          pendingKeywordsRef.current = pendingKeywordsRef.current.map(
            (keyword) => (keyword.word === oldKey ? newKeyword : keyword),
          );
          // Propagate changes to the parent component.
          handleOnChanges(pendingKeywordsRef.current);
        }}
        onDeleteSelection={handleDelete}
      />
    </Stack>
  );
};

export default KeyWords;
