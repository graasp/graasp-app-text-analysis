import { FC, KeyboardEventHandler, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  TextField,
} from '@mui/material';

import { KEYWORDS_SETTING_KEY } from '../config/appSettingTypes';
import {
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_KEYWORD_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
  SAVE_KEYWORDS_BUTTON_CY,
} from '../config/selectors';
import { useAppSettingContext } from './context/AppSettingContext';

const ENTER_KEY = 'Enter';

const KeyWords: FC = () => {
  const [word, setWord] = useState('');
  const [keywordsList, setKeyWordsList] = useState<string[]>([]);
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

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

  const handleClickSave = (): void => {
    const keywordsResourceSetting = appSettingArray.find(
      (s) => s.name === KEYWORDS_SETTING_KEY,
    );

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
      sx={{ bgcolor: '#BABABA' }}
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
    <Box maxWidth={210} width="100%" marginLeft="25px">
      <TextField
        data-cy={ENTER_KEYWORD_FIELD_CY}
        label="Enter keyword"
        value={word}
        onChange={onChange}
        onKeyPress={onEnterPress}
      />
      <List>{keyWordsItems}</List>
      <Button
        data-cy={SAVE_KEYWORDS_BUTTON_CY}
        variant="contained"
        sx={{
          backgroundColor: '#5050d2',
          width: '100%',
        }}
        onClick={handleClickSave}
      >
        Save
      </Button>
    </Box>
  );
};

export default KeyWords;
