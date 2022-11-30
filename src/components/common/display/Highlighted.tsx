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
  const snippet = parts
    .map((part) =>
      wordsLowerCase.includes(part.toLocaleLowerCase()) ? `*${part}*` : part,
    )
    .join('');

  // eslint-disable-next-line
  const parseComponent = ({ children }: { children: any }) => {
    const wordLowerCase = children[0].toLocaleLowerCase();
    if (!wordsLowerCase.includes(wordLowerCase)) {
      return <em>{wordLowerCase}</em>;
    }
    return (
      <Button
        data-cy={KEYWORD_BUTTON_CY}
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
        onClick={openChatbot}
      >
        <span>{children[0]}</span>
      </Button>
    );
  };

  return (
    <StyledReactMarkdown
      components={{
        em: parseComponent,
      }}
    >
      {snippet}
    </StyledReactMarkdown>
  );
};

export default Highlighted;
