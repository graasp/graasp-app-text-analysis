import randomColor from 'randomcolor';
import remarkBreaks from 'remark-breaks';

import { FC } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button, styled } from '@mui/material';

import { keyword } from '../../../config/appSettingTypes';
import { DEFAULT_KEYWORD } from '../../../config/appSettings';
import { keywordDataCy } from '../../../config/selectors';

type Prop = {
  text: string;
  words: keyword[];
  highlight: boolean;
  openChatbot: (word: keyword) => void;
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

  const wordsLowerCase = words.map((word) => word.word.toLocaleLowerCase());
  const expr = wordsLowerCase.join('|');
  const parts = text.split(new RegExp(`(${expr})`, 'gi'));
  const findKeyword = (part: string): keyword =>
    words.find((w) => w.word === part) || DEFAULT_KEYWORD;
  const snippet = parts
    .map((part) =>
      // todo: check that the there is no italic already otherwise we will change it to bold which we do not want
      wordsLowerCase.includes(part.toLocaleLowerCase()) ? `*${part}*` : part,
    )
    .join('');

  // eslint-disable-next-line
  const parseComponent = ({ children }: { children: any }) => {
    // todo: handle this better
    if (typeof children[0] !== 'string') {
      return children[0];
    }
    const wordLowerCase = children[0].toLocaleLowerCase();
    if (!wordsLowerCase.includes(wordLowerCase)) {
      return <em>{wordLowerCase}</em>;
    }

    return (
      <Button
        data-cy={keywordDataCy(children[0].toLocaleLowerCase())}
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
        onClick={() =>
          openChatbot(findKeyword(children[0].toLocaleLowerCase()))
        }
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
