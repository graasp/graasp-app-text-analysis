import randomColor from 'randomcolor';

import { FC } from 'react';

import { Button } from '@mui/material';

import { keyword } from '../../../config/appSettingTypes';
import { DEFAULT_KEYWORD } from '../../../config/appSettings';
import { KEYWORD_BUTTON_CY } from '../../../config/selectors';

type Prop = {
  text: string;
  words: keyword[];
  highlight: boolean;
  openChatbot: (word: keyword) => void;
};

const Highlighted: FC<Prop> = ({ text, words, highlight, openChatbot }) => {
  if (!highlight || words.length === 0) {
    return <span>{text}</span>;
  }

  const wordsLowerCase = words.map(({ word }) => word.toLocaleLowerCase());
  const expr = wordsLowerCase.join('|');
  const parts = text.split(new RegExp(`(${expr})`, 'gi'));

  const findKeyword = (part: string): keyword =>
    words.find((w) => w.word === part) || DEFAULT_KEYWORD;

  return (
    <span>
      {parts.map((part, i) =>
        wordsLowerCase.includes(part.toLocaleLowerCase()) ? (
          <Button
            data-cy={KEYWORD_BUTTON_CY}
            sx={{
              backgroundColor: randomColor({ seed: part.toLocaleLowerCase() }),
              maxHeight: '23px',
              minWidth: '10px',
              textTransform: 'none',
              color: 'black',
              fontWeight: '400',
            }}
            key={i}
            onClick={() => openChatbot(findKeyword(part.toLocaleLowerCase()))}
          >
            {part}
          </Button>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

export default Highlighted;
