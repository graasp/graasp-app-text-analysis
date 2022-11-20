import { FC, KeyboardEventHandler, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, IconButton, List, ListItem, TextField } from '@mui/material';

import { KEYWORDS_SETTING_KEY } from '../../../config/appSettingTypes';
import { DEFAULT_KEYWORDS_LIST } from '../../../config/appSettings';
import {
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_KEYWORD_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
  SAVE_KEYWORDS_BUTTON_CY,
} from '../../../config/selectors';
import {
  DEFAULT_MARGIN,
  FULL_WIDTH,
  GREY,
} from '../../../config/stylingConstants';
import { useAppSettingContext } from '../../context/AppSettingContext';
import SaveButton from './SaveButton';

const ENTER_KEY = 'Enter';

type keywordsResourceData = { keywords: string[] };

const KeyWords: FC = () => {
  const [word, setWord] = useState('');
  const [keywordsList, setKeyWordsList] = useState<string[]>([]);
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const areEqual = (arr1: string[], arr2: string[]): boolean =>
    arr1.length === arr2.length && arr1.every((s, i) => s === arr2[i]);

  const onChange = ({ target }: { target: { value: string } }): void => {
    setWord(target.value);
  };

  const onEnterPress: KeyboardEventHandler<HTMLDivElement> = (event): void => {
    if (event.key === ENTER_KEY) {
      const element = event.target as HTMLInputElement;
      const wordToLowerCase = element.value.toLocaleLowerCase();
      if (!keywordsList.includes(wordToLowerCase)) {
        setKeyWordsList([...keywordsList, wordToLowerCase]);
      }
      setWord('');
    }
  };

  const handleDelete = (id: string): void => {
    setKeyWordsList(keywordsList.filter((keyword) => keyword !== id));
  };

  const keywordsResourceSetting = appSettingArray.find(
    (s) => s.name === KEYWORDS_SETTING_KEY,
  );

  const keywordsResourceData = (keywordsResourceSetting?.data ||
    DEFAULT_KEYWORDS_LIST) as keywordsResourceData;

  const handleClickSave = (): void => {
    if (keywordsResourceSetting) {
      patchAppSetting({
        data: { keywords: keywordsList },
        id: keywordsResourceSetting.id,
      });
    } else {
      postAppSetting({
        data: { keywords: keywordsList },
        name: KEYWORDS_SETTING_KEY,
      });
    }
  };

  const keyWordsItems = keywordsList.map((keyword) => (
    <ListItem
      data-cy={KEYWORD_LIST_ITEM_CY}
      key={keyword}
      sx={{ bgcolor: GREY }}
      secondaryAction={
        <IconButton
          data-cy={DELETE_KEYWORD_BUTTON_CY}
          edge="end"
          aria-label="delete"
          onClick={() => handleDelete(keyword)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      {keyword}
    </ListItem>
  ));

  return (
    <Box maxWidth={210} width={FULL_WIDTH} marginLeft={DEFAULT_MARGIN}>
      <TextField
        data-cy={ENTER_KEYWORD_FIELD_CY}
        label="Enter keyword"
        value={word}
        onChange={onChange}
        onKeyPress={onEnterPress}
      />
      <List>{keyWordsItems}</List>
      <SaveButton
        buttonDataCy={SAVE_KEYWORDS_BUTTON_CY}
        fullWidth
        handleOnClick={handleClickSave}
        disabled={areEqual(keywordsList, keywordsResourceData.keywords)}
      />
    </Box>
  );
};

export default KeyWords;
