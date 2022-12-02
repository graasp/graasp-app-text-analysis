import { FC, KeyboardEventHandler, useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, List, ListItem, TextField } from '@mui/material';

import {
  KEYWORDS_SETTING_KEY,
  KeywordsData,
  keyword,
} from '../../../config/appSettingTypes';
import { DEFAULT_KEYWORDS_LIST } from '../../../config/appSettings';
import { ENTER_KEY } from '../../../config/constants';
import {
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_KEYWORD_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
  SAVE_KEYWORDS_BUTTON_CY,
} from '../../../config/selectors';
import { DEFAULT_MARGIN, FULL_WIDTH } from '../../../config/stylingConstants';
import { useAppSettingContext } from '../../context/AppSettingContext';
import SaveButton from './SaveButton';

const KeyWords: FC = () => {
  const [word, setWord] = useState('');
  const [dictionary, setDictionary] = useState<keyword[]>([]);
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const onChange = ({ target }: { target: { value: string } }): void => {
    setWord(target.value);
  };

  const isKeywordListEqual = (l1: keyword[], l2: keyword[]): boolean =>
    l1.length === l2.length &&
    l1.every((e1) => l2.some((e2) => e1.word === e2.word && e1.def === e2.def));

  const onEnterPress: KeyboardEventHandler<HTMLDivElement> = (event): void => {
    if (event.key === ENTER_KEY) {
      const element = event.target as HTMLInputElement;
      const settings = element.value.split(':');
      const wordToLowerCase = settings[0].toLocaleLowerCase();
      const definition =
        settings[1] !== undefined ? settings[1] : 'no definition';
      const newKeyword = { word: wordToLowerCase, def: definition };
      if (
        wordToLowerCase !== '' &&
        !dictionary.some((k) => k.word === wordToLowerCase)
      ) {
        setDictionary([...dictionary, newKeyword]);
      }
      setWord('');
    }
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
        sx={{ marginRight: '5px' }}
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
          label="Enter keyword:definition"
          sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
          value={word}
          onChange={onChange}
          onKeyPress={onEnterPress}
        />
        <SaveButton
          buttonDataCy={SAVE_KEYWORDS_BUTTON_CY}
          handleOnClick={() => handleClickSave()}
          disabled={isKeywordListEqual(dictionary, keywords)}
          marginRight={DEFAULT_MARGIN}
          minHeight="55px"
        />
      </Box>
      <List>{keyWordsItems}</List>
    </Box>
  );
};

export default KeyWords;
