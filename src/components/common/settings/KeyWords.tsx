import { FC, useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, List, ListItem, TextField } from '@mui/material';

import {
  KEYWORDS_SETTING_KEY,
  KeywordsData,
  keyword,
} from '../../../config/appSettingTypes';
import { DEFAULT_KEYWORDS_LIST } from '../../../config/appSettings';
import {
  ADD_KEYWORD_BUTTON_CY,
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_DEFINITION_FIELD_CY,
  ENTER_KEYWORD_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
  SAVE_KEYWORDS_BUTTON_CY,
} from '../../../config/selectors';
import {
  DEFAULT_MARGIN,
  FULL_WIDTH,
  ICON_MARGIN,
} from '../../../config/stylingConstants';
import { useAppSettingContext } from '../../context/AppSettingContext';
import GraaspButton from './GraaspButton';

type KeywordDefinition = {
  keyword: string;
  definition: string;
};

const KeyWords: FC = () => {
  const defaultKeywordDef = { keyword: '', definition: '' };

  const [keywordDef, setKeywordDef] =
    useState<KeywordDefinition>(defaultKeywordDef);

  const [dictionary, setDictionary] = useState<keyword[]>([]);
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const updateKeywordDefinition = (
    key: keyof KeywordDefinition,
    target: { value: string },
  ): void => {
    setKeywordDef({
      ...keywordDef,
      [key]: target.value,
    });
  };

  const isKeywordListEqual = (l1: keyword[], l2: keyword[]): boolean =>
    l1.length === l2.length &&
    l1.every((e1) => l2.some((e2) => e1.word === e2.word && e1.def === e2.def));

  const isDefinitionSet = keywordDef.definition && keywordDef.definition !== '';

  const handleClickAdd = (): void => {
    const wordToLowerCase = keywordDef.keyword.toLocaleLowerCase();
    const definition = isDefinitionSet
      ? keywordDef.definition
      : 'no definition';
    const newKeyword = { word: wordToLowerCase, def: definition };
    if (
      wordToLowerCase !== '' &&
      !dictionary.some((k) => k.word === wordToLowerCase)
    ) {
      setDictionary([...dictionary, newKeyword]);
    }
    setKeywordDef(defaultKeywordDef);
  };

  const handleDelete = (id: string): void => {
    setDictionary(dictionary.filter((k) => k.word !== id));
  };

  const keywordsResourceSetting = appSettingArray.find(
    (s) => s.name === KEYWORDS_SETTING_KEY,
  );

  const { keywords } = (keywordsResourceSetting?.data ||
    DEFAULT_KEYWORDS_LIST) as KeywordsData;

  useEffect(() => {
    setDictionary(keywords);
  }, [keywords]);

  const handleClickSave = (): void => {
    if (keywordsResourceSetting) {
      patchAppSetting({
        data: { keywords: dictionary },
        id: keywordsResourceSetting.id,
      });
    } else {
      postAppSetting({
        data: { keywords: dictionary },
        name: KEYWORDS_SETTING_KEY,
      });
    }
  };

  const keyWordsItems = dictionary.map((k) => (
    <ListItem
      data-cy={KEYWORD_LIST_ITEM_CY}
      key={k.word}
      sx={{ padding: '0px' }}
    >
      <IconButton
        data-cy={DELETE_KEYWORD_BUTTON_CY}
        aria-label="delete"
        sx={{ marginRight: ICON_MARGIN }}
        onClick={() => handleDelete(k.word)}
      >
        <DeleteIcon />
      </IconButton>
      {`${k.word} : ${k.def}`}
    </ListItem>
  ));

  return (
    <Box sx={{ margin: DEFAULT_MARGIN }}>
      <Box
        component="span"
        justifyContent="space-around"
        display="flex"
        alignItems="center"
      >
        <TextField
          data-cy={ENTER_KEYWORD_FIELD_CY}
          label="Enter the keyword"
          sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
          value={keywordDef.keyword}
          onChange={(e) => updateKeywordDefinition('keyword', e.target)}
        />
        <TextField
          data-cy={ENTER_DEFINITION_FIELD_CY}
          label="Enter the keyword's definition"
          sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
          value={keywordDef.definition}
          onChange={(e) => updateKeywordDefinition('definition', e.target)}
        />
        <GraaspButton
          buttonDataCy={ADD_KEYWORD_BUTTON_CY}
          handleOnClick={handleClickAdd}
          disabled={!keywordDef.keyword}
          marginRight={DEFAULT_MARGIN}
          minHeight="55px"
          text="Add"
        />
        <GraaspButton
          buttonDataCy={SAVE_KEYWORDS_BUTTON_CY}
          handleOnClick={handleClickSave}
          disabled={isKeywordListEqual(dictionary, keywords)}
          marginRight={DEFAULT_MARGIN}
          minHeight="55px"
          text="Save"
        />
      </Box>
      <List>{keyWordsItems}</List>
    </Box>
  );
};

export default KeyWords;
