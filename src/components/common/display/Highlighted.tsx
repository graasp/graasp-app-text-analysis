import randomColor from 'randomcolor';
import remarkBreaks from 'remark-breaks';

import { FC } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button, styled } from '@mui/material';

import { KEYWORD_BUTTON_CY } from '../../../config/selectors';

type Prop = {
  text: string;
  words: string[];
  highlight: boolean;
  openChatbot: () => void;
};

const StyledReactMarkdown = styled(ReactMarkdown)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  '& *': {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  '& h1 p': {
    marginTop: theme.spacing(1),
  },
  '& p': {
    lineHeight: '1.5',
    fontSize: '1rem',
  },
}));

const Highlighted: FC<Prop> = ({ text, words, highlight, openChatbot }) => {
  if (!highlight || words.length === 0) {
    return (
      <StyledReactMarkdown remarkPlugins={[remarkBreaks]}>
        {text}
      </StyledReactMarkdown>
    );
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
              fontWeight: 'inherit',
            }}
            key={i}
            onClick={openChatbot}
          >
            <StyledReactMarkdown key={i}>{part}</StyledReactMarkdown>
          </Button>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

export default Highlighted;
