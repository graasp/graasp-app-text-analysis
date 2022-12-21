import randomColor from 'randomcolor';
import remarkBreaks from 'remark-breaks';

import { FC, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

import { Button, styled } from '@mui/material';

import { keyword } from '../../../config/appSettingTypes';
import { DEFAULT_KEYWORD } from '../../../config/appSettings';
import KeywordButton from './KeywordButton';

type Prop = {
  text: string;
  words: keyword[];
  highlight: boolean;
  openChatbot: (word: keyword, ref?: HTMLButtonElement) => void;
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
      wordsLowerCase.includes(part.toLocaleLowerCase()) ? `\`${part}\`` : part,
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
      return <code>{wordLowerCase}</code>;
    }

    return (
      <KeywordButton
        word={{
          label: children[0],
          value: findKeyword(children[0].toLocaleLowerCase()),
        }}
        onClick={openChatbot}
      />
    );
  };

  return (
    <StyledReactMarkdown
      components={{
        code: parseComponent,
      }}
    >
      {snippet}
    </StyledReactMarkdown>
  );
};

export default Highlighted;
