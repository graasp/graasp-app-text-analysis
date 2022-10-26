import { FC, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  TextField,
} from '@mui/material';

const ENTER_KEY = 'Enter';

type keyWord = { word: string; id: number };

const KeyWords: FC = () => {
  const [word, setWord] = useState('');
  const [keyWordsList, setKeyWordsList] = useState<keyWord[]>([]);

  const onChange = ({ target }: { target: { value: string } }): void => {
    setWord(target.value);
  };

  const onEnterPress = (event: { key: string; target: any }): void => {
    // TODO ajouter le type
    if (event.key === ENTER_KEY) {
      setKeyWordsList([
        ...keyWordsList,
        { word: event.target.value, id: keyWordsList.length + 1 },
      ]);
      setWord('');
    }
  };

  const keyWordsItems = keyWordsList.map((keyWord) => (
    <ListItem
      key={keyWord.id}
      sx={{ bgcolor: '#BABABA' }}
      secondaryAction={
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      }
    >
      {keyWord.word}
    </ListItem>
  ));

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 210,
        marginLeft: '25px',
      }}
    >
      <TextField
        label="Enter key word"
        value={word}
        onChange={onChange}
        onKeyPress={onEnterPress}
      />
      <List>{keyWordsItems}</List>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#5050d2',
          width: '100%',
        }}
      >
        Save
      </Button>
    </Box>
  );
};

export default KeyWords;
