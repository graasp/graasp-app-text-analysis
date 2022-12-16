import { List, RecordOf } from 'immutable';

import { FC, useEffect, useRef, useState } from 'react';

import { LocalContext, useLocalContext } from '@graasp/apps-query-client';

import { Alert, AlertTitle, Box, Stack, styled } from '@mui/material';

import { APP_DATA_TYPES, ChatAppData } from '../../../config/appDataTypes';
import {
  INITIAL_PROMPT_SETTING_KEY,
  TextResourceData,
} from '../../../config/appSettingTypes';
import { DEFAULT_INITIAL_PROMPT } from '../../../config/appSettings';
import {
  ANONYMOUS_USER,
  CHATBOT_PREFIX,
  CHATBOT_RESPONSE_URL,
  MAX_CONVERSATION_LENGTH,
  MAX_CONVERSATION_LENGTH_ALERT,
  SCROLL_SAFETY_MARGIN,
  STUDENT_PREFIX,
} from '../../../config/constants';
import { CHATBOT_MODE_CY, messagesDataCy } from '../../../config/selectors';
import {
  DEFAULT_BORDER_RADIUS,
  LIGHT_GRAY,
  LIGHT_VIOLET,
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

const StyledBotMessage = styled(StyledMessage)(() => ({
  backgroundColor: LIGHT_VIOLET,
}));

const StyledUserMessage = styled(StyledMessage)(() => ({
  backgroundColor: LIGHT_GRAY,
}));

type Prop = { focusWord: string; isOpen: boolean };

const ChatBox: FC<Prop> = ({ focusWord, isOpen }) => {
  const { postAppDataAsync, postAppData, appDataArray } = useAppDataContext();
  const { appSettingArray } = useAppSettingContext();
  const context: RecordOf<LocalContext> = useLocalContext();
  const member = useMembersContext().find(
    (m) => m.id === context.get('memberId'),
  );
  const memberName = member?.name || ANONYMOUS_USER;
  const initial = memberName.toLocaleUpperCase().trim()[0];
  const [loading, setLoading] = useState(false);

  const initialPrompt = (
    (appSettingArray.find((s) => s.name === INITIAL_PROMPT_SETTING_KEY)?.data ||
      DEFAULT_INITIAL_PROMPT) as TextResourceData
  ).text.replace('{{keyword}}', focusWord);

  const chatAppData = appDataArray
    .filter(
      (data) =>
        (data.type === APP_DATA_TYPES.BOT_COMMENT ||
          data.type === APP_DATA_TYPES.STUDENT_COMMENT) &&
        data.data.keyword === focusWord,
    )
    .sort((a, b) =>
      Date.parse(a.createdAt) > Date.parse(b.createdAt) ? 1 : -1,
    ) as List<ChatAppData>;

  const fetchApi = async (input: string): Promise<{ completion: string }> => {
    const chatConcatMessages = chatAppData
      .map((data) => {
        const prefix =
          data.type === APP_DATA_TYPES.BOT_COMMENT
            ? CHATBOT_PREFIX
            : STUDENT_PREFIX;
        return `${prefix}: ${data.data.message}`;
      })
      .unshift(initialPrompt)
      .push(`${STUDENT_PREFIX}: ${input}`)
      .join('\n\n')
      .concat('\n\n');

    setLoading(true);
    const response = await fetch(CHATBOT_RESPONSE_URL, {
      method: 'POST',
      body: JSON.stringify({ prompt: chatConcatMessages }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const json = await response.json();
    return json;
  };

  const onSend = (input: string): void => {
    if (input.trim() !== '') {
      postAppDataAsync({
        data: { message: input, keyword: focusWord },
        type: APP_DATA_TYPES.STUDENT_COMMENT,
      })
        ?.then(() => fetchApi(input))
        .then((json) => {
          setLoading(false);
          postAppData({
            data: {
              message: json.completion.replace(`${CHATBOT_PREFIX}:`, '').trim(),
              keyword: focusWord,
            },
            type: APP_DATA_TYPES.BOT_COMMENT,
          });
        });
    }
  };

  const renderBar =
    chatAppData.size > MAX_CONVERSATION_LENGTH ? (
      <Alert severity="info">
        <AlertTitle>Info</AlertTitle>
        {MAX_CONVERSATION_LENGTH_ALERT}
      </Alert>
    ) : (
      <InputBar onSend={(input) => onSend(input)} />
    );

  const renderedMesssages = chatAppData.map((msg) =>
    msg.type === APP_DATA_TYPES.STUDENT_COMMENT ? (
      <UserBox data-cy={messagesDataCy(msg.id)} key={msg.id} initial={initial}>
        <StyledUserMessage key={msg.id} alignSelf="flex-end">
          {msg.data.message}
        </StyledUserMessage>
      </UserBox>
    ) : (
      <ChatbotBox data-cy={messagesDataCy(msg.id)} key={msg.id}>
        <StyledBotMessage key={msg.id} alignSelf="flex-start">
          {msg.data.message}
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
            <StyledBotMessage alignSelf="flex-start">...</StyledBotMessage>
          </ChatbotBox>
        )}
      </Box>
      {renderBar}
    </Stack>
  );
};
export default ChatBox;
