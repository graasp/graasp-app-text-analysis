import { FC } from 'react';

import { Button } from '@mui/material';

import { KEYWORD_BUTTON_CY } from '../../../config/selectors';

type Prop = { text: string; words: string[]; highlight: boolean };

const Highlighted: FC<Prop> = ({ text, words, highlight }) => {
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
              backgroundColor: 'yellow',
              maxHeight: '25px',
              minWidth: '10px',
              textTransform: 'none',
              color: 'black',
              fontWeight: '400',
            }}
            key={i}
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
