import { FC, useRef } from 'react';

import { Button } from '@mui/material';

import { keyword } from '../../../config/appSettingTypes';
import { keywordDataCy } from '../../../config/selectors';

type Prop = {
  word: {
    label: string;
    value: keyword;
  };
  onClick: (word: keyword, ref?: HTMLButtonElement) => void;
};

const KeywordButton: FC<Prop> = ({ word, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement | undefined>();

  // TO DO : this doesn't work, change
  return (
    <Button
      ref={buttonRef}
      data-cy={keywordDataCy(word.label.toLocaleLowerCase())}
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
      onClick={() => onClick(word.value, buttonRef)}
    >
      <span>{word.label}</span>
    </Button>
  );
};

export default KeywordButton;
