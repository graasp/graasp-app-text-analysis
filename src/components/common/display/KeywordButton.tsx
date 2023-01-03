import randomColor from 'randomcolor';

import { FC, RefObject, useMemo, useRef } from 'react';

import { Button } from '@mui/material';

import { keyword } from '../../../config/appSettingTypes';
import { keywordDataCy } from '../../../config/selectors';

export type KeywordButtonRef = RefObject<HTMLButtonElement | null>;

type Prop = {
  word: {
    label: string;
    value: keyword;
  };
  onClick: (word: keyword, ref: KeywordButtonRef) => void;
};

const KeywordButton: FC<Prop> = ({ word, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wordLowerCase = word.label.toLowerCase();

  return useMemo(
    () => (
      <Button
        ref={buttonRef}
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
        onClick={() => onClick(word.value, buttonRef)}
      >
        <span>{word.label}</span>
      </Button>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [word],
  );
};

export default KeywordButton;
