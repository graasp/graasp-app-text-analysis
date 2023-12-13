import randomColor from 'randomcolor';

import { FC } from 'react';

import { Button } from '@mui/material';

import { Keyword } from '../../../config/appSettingTypes';
import { keywordDataCy } from '../../../config/selectors';

type Prop = {
  word: {
    label: string;
    value: Keyword;
  };
  onClick: (word: Keyword) => void;
};

const KeywordButton: FC<Prop> = ({ word, onClick }) => {
  const wordLowerCase = word.label.toLowerCase();

  return (
    <Button
      data-cy={keywordDataCy(wordLowerCase)}
      sx={{
        backgroundColor: randomColor({
          seed: wordLowerCase,
          luminosity: 'light',
        }),
        minWidth: '10px',
        textTransform: 'none',
        color: 'black',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        paddingY: '1px',
      }}
      onClick={() => onClick(word.value)}
    >
      <span>{word.label}</span>
    </Button>
  );
};

export default KeywordButton;
