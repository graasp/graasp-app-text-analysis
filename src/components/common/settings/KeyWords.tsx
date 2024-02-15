import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { Alert, Box, Stack, TextField } from '@mui/material';

import { TEXT_ANALYSIS } from '@/langs/constants';

import { Keyword } from '../../../config/appSettingTypes';
import {
  ADD_KEYWORD_BUTTON_CY,
  ENTER_DEFINITION_FIELD_CY,
  ENTER_KEYWORD_FIELD_CY,
} from '../../../config/selectors';
import { DEFAULT_IN_SECTION_SPACING } from '../../../config/stylingConstants';
import Table from '../table/Table';
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

  const handleDelete = (deletedKeywords: Keyword[]): void => {
    handleOnChanges(keywords.filter((k) => !deletedKeywords.includes(k)));
  };

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
      <Table
        keywords={keywords}
        text={textStudents}
        onUpdate={(oldKey, newKeyword) => {
          const updatedKeywords = keywords.map((keyword) =>
            keyword.word === oldKey ? newKeyword : keyword,
          );
          handleOnChanges(updatedKeywords);
        }}
        onDeleteSelection={handleDelete}
      />
    </Stack>
  );
};

export default KeyWords;
