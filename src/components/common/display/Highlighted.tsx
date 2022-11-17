import randomColor from 'randomcolor';

import { FC } from 'react';

import { Button } from '@mui/material';

import { KEYWORD_BUTTON_CY } from '../../../config/selectors';

type Prop = {
  text: string;
  words: string[];
  highlight: boolean;
  openChatbot: () => void;
};

const Highlighted: FC<Prop> = ({ text, words, highlight, openChatbot }) => {
  if (!highlight || words.length === 0) {
    return <span>{text}</span>;
  }

  const expr = words.join('|');
  const parts = text.split(new RegExp(`(${expr})`, 'gi'));
  const wordsLowerCase = words.map((word) => word.toLocaleLowerCase());

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
            onClick={openChatbot}
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
