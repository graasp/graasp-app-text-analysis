import randomColor from 'randomcolor';

import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import {
  ChatbotThreadMessage,
  buildPrompt,
  useLocalContext,
} from '@graasp/apps-query-client';

import { Alert, Box, Stack, styled } from '@mui/material';

import { TEXT_ANALYSIS } from '@/langs/constants';
import { replaceWordCaseInsensitive } from '@/utils/keywords';

import { APP_DATA_TYPES, ChatAppData } from '../../../config/appDataTypes';
import {
  INITIAL_PROMPT_SETTING_KEY,
  KeywordWithLabel,
  TextResourceData,
} from '../../../config/appSettingTypes';
import { DEFAULT_INITIAL_PROMPT } from '../../../config/appSettings';
import {
  ANONYMOUS_USER,
  MAX_CONVERSATION_LENGTH,
  SCROLL_SAFETY_MARGIN,
} from '../../../config/constants';
import { mutations } from '../../../config/queryClient';
import { CHATBOT_MODE_CY, messagesDataCy } from '../../../config/selectors';
import {
  DEFAULT_BORDER_RADIUS,
  LIGHT_GRAY,
} from '../../../config/stylingConstants';
import { useAppDataContext } from '../../context/AppDataContext';
import { useAppSettingContext } from '../../context/AppSettingContext';
import { useMembersContext } from '../../context/MembersContext';
import ChatbotBox from './ChatbotBox';
import InputBar from './InputBar';
import UserBox from './UserBox';

const StyledMessage = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  width: '70%',
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  flexWrap: 'wrap',
  wordBreak: 'break-word',
}));

interface StyledBotMessageProps {
  wordLowerCase: string;
}

const StyledBotMessage = styled(StyledMessage)<StyledBotMessageProps>(
  ({ wordLowerCase }: StyledBotMessageProps) => ({
    backgroundColor: randomColor({
      seed: wordLowerCase,
      luminosity: 'light',
    }),
  }),
);

const StyledUserMessage = styled(StyledMessage)(() => ({
  backgroundColor: LIGHT_GRAY,
}));

const StyledReactMarkdown = styled(ReactMarkdown)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  '& p': {
    margin: '0px',
  },
}));

type Prop = { focusWord: KeywordWithLabel; isOpen: boolean };

const ChatBox: FC<Prop> = ({ focusWord, isOpen }) => {
  const { t } = useTranslation();
  const { postAppDataAsync, postAppData, appDataArray } = useAppDataContext();
  const { appSettingArray } = useAppSettingContext();
  const context = useLocalContext();
  const member = useMembersContext().find((m) => m.id === context.memberId);
  const memberName = member?.name || ANONYMOUS_USER;
  const initial = memberName.toLocaleUpperCase().trim()[0];
  const [loading, setLoading] = useState(false);
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();

  const initialPrompt = (
    (appSettingArray.find((s) => s.name === INITIAL_PROMPT_SETTING_KEY)?.data ||
      DEFAULT_INITIAL_PROMPT) as TextResourceData
  ).text.replaceAll('{{keyword}}', focusWord.label);

  const chatAppData = appDataArray
    .filter(
      (data) =>
        (data.type === APP_DATA_TYPES.BOT_COMMENT ||
          data.type === APP_DATA_TYPES.STUDENT_COMMENT) &&
        data.data.keyword === focusWord.word,
    )
    .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)) as ChatAppData[];

  const onSend = (input: string): void => {
    if (input.trim() !== '') {
      postAppDataAsync({
        data: { message: input, keyword: focusWord.word },
        type: APP_DATA_TYPES.STUDENT_COMMENT,
      })?.then(() => {
        const thread: ChatbotThreadMessage[] = chatAppData.map((data) => ({
          botDataType: APP_DATA_TYPES.BOT_COMMENT,
          msgType: data.type,
          data: data.data.message,
        }));

        const prompt = buildPrompt(initialPrompt, thread, input);

        setLoading(true);

        const appData = {
          message: t(TEXT_ANALYSIS.CHAT_BOT_ERROR_MESSAGE),
          keyword: focusWord.word,
        };

        postChatBot(prompt)
          .then((chatBotRes) => {
            appData.message = chatBotRes.completion;
          })
          .finally(() => {
            setLoading(false);
            postAppData({
              data: appData,
              type: APP_DATA_TYPES.BOT_COMMENT,
            });
          });
      });
    }
  };

  const renderBar =
    chatAppData.length > MAX_CONVERSATION_LENGTH ? (
      <Alert severity="info">
        {t(TEXT_ANALYSIS.MAX_CONVERSATION_LENGTH_ALERT)}
      </Alert>
    ) : (
      <InputBar onSend={(input) => onSend(input)} />
    );

  const renderedMesssages = chatAppData.map((msg, idx) =>
    msg.type === APP_DATA_TYPES.STUDENT_COMMENT ? (
      <UserBox data-cy={messagesDataCy(msg.id)} key={msg.id} initial={initial}>
        <StyledUserMessage key={msg.id} alignSelf="flex-end">
          {msg.data.message}
        </StyledUserMessage>
      </UserBox>
    ) : (
      <ChatbotBox data-cy={messagesDataCy(msg.id)} key={msg.id}>
        <StyledBotMessage
          key={msg.id}
          alignSelf="flex-start"
          wordLowerCase={focusWord.word.toLowerCase()}
        >
          <StyledReactMarkdown>
            {/* If it is the first chatbot message, replace all keywords by the label, to keep case as in the text. */}
            {/* It is replaced here too, to handle AppData with keyword in lower case. */}
            {idx === 0
              ? replaceWordCaseInsensitive(
                  msg.data.message,
                  focusWord.word,
                  focusWord.label,
                )
              : msg.data.message}
          </StyledReactMarkdown>
        </StyledBotMessage>
      </ChatbotBox>
    ),
  );

  const ref = useRef<HTMLDivElement>(null);

  // scroll down to last message at start, on new message and on editing message
  useEffect(() => {
    if (ref?.current) {
      // temporarily hide the scroll bars when scrolling the container
      ref.current.style.overflowY = 'hidden';
      // scroll down the height of the container + some margin to make sure we are at the bottom
      ref.current.scrollTop = ref.current.scrollHeight + SCROLL_SAFETY_MARGIN;
      // re-activate scroll
      ref.current.style.overflowY = 'auto';
    }
  }, [ref, appDataArray, isOpen, focusWord]);

  return (
    <Stack data-cy={CHATBOT_MODE_CY} direction="column">
      <Box
        ref={ref}
        display="flex"
        flexDirection="column"
        height="500px"
        borderRadius={DEFAULT_BORDER_RADIUS}
        sx={{ overflowY: 'scroll' }}
      >
        {renderedMesssages}
        {loading && (
          <ChatbotBox>
            <StyledBotMessage
              alignSelf="flex-start"
              wordLowerCase={focusWord.word.toLowerCase()}
            >
              ...
            </StyledBotMessage>
          </ChatbotBox>
        )}
      </Box>
      {renderBar}
    </Stack>
  );
};
export default ChatBox;
