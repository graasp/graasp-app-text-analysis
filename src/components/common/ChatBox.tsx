/* eslint-disable arrow-body-style */
import { RecordOf } from 'immutable';

import { FC, useEffect, useState } from 'react';

import { LocalContext, useLocalContext } from '@graasp/apps-query-client';

import { Box, styled } from '@mui/material';

import { APP_DATA_TYPES, MessageData } from '../../config/appDataTypes';
import {
  INITIAL_PROMPT_SETTING_KEY,
  TextResourceData,
} from '../../config/appSettingTypes';
import { DEFAULT_INITIAL_PROMPT } from '../../config/appSettings';
import { ANONYMOUS_USER, CHATBOT_RESPONSE_URL } from '../../config/constants';
import { LIGHT_GRAY, LIGHT_VIOLET } from '../../config/stylingConstants';
import { useAppDataContext } from '../context/AppDataContext';
import { useAppSettingContext } from '../context/AppSettingContext';
import { useMembersContext } from '../context/MembersContext';
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

type Prop = { focusWord: string };

const ChatBox: FC<Prop> = ({ focusWord }) => {
  const { postAppData, appDataArray } = useAppDataContext();
  const { appSettingArray } = useAppSettingContext();
  const context: RecordOf<LocalContext> = useLocalContext();
  const member = useMembersContext().find(
    (m) => m.id === context.get('memberId'),
  );
  const memberName = member?.name || ANONYMOUS_USER;

  const initialPrompt = (
    (appSettingArray.find((s) => s.name === INITIAL_PROMPT_SETTING_KEY)?.data ||
      DEFAULT_INITIAL_PROMPT) as TextResourceData
  ).text.replace('keyword', focusWord);

  const [userPrompt, setUserPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const chatAppData = appDataArray.filter((data) => {
    return (
      (data.type === APP_DATA_TYPES.BOT_COMMENT ||
        data.type === APP_DATA_TYPES.STUDENT_COMMENT) &&
      (data.data as MessageData).keyword === focusWord
    );
  });

  useEffect(() => {
    const chatConcatMessages = chatAppData
      .map((data) => `${data.type}: ${(data.data as MessageData).message}`)
      .unshift(initialPrompt)
      .join('\n\n');
    setUserPrompt(chatConcatMessages);
  }, [appDataArray]);

  const fetchApi = async (): Promise<{ completion: string }> => {
    setLoading(true);
    const response = await fetch(CHATBOT_RESPONSE_URL, {
      method: 'POST',
      body: JSON.stringify({ prompt: userPrompt }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const json = await response.json();
    return json;
  };

  const onSend = (): void => {
    fetchApi().then((json) => {
      setLoading(false);
      postAppData({
        data: { message: json.completion, keyword: focusWord },
        type: APP_DATA_TYPES.BOT_COMMENT,
      });
    });
  };

  return (
    <Box display="flex" flexDirection="column">
      {chatAppData.map((msg) => {
        const isUser = msg.type === APP_DATA_TYPES.STUDENT_COMMENT;
        if (isUser) {
          return (
            <UserBox key={msg.id} userName={memberName}>
              <StyledUserMessage key={msg.id} alignSelf="flex-end">
                {(msg.data as MessageData).message}
              </StyledUserMessage>
            </UserBox>
          );
        }
        return (
          <ChatbotBox key={msg.id}>
            <StyledBotMessage key={msg.id} alignSelf="flex-start">
              {(msg.data as MessageData).message}
            </StyledBotMessage>
          </ChatbotBox>
        );
      })}
      {loading && (
        <ChatbotBox key="loading">
          <StyledBotMessage alignSelf="flex-start">...</StyledBotMessage>
        </ChatbotBox>
      )}

      <InputBar onSend={onSend} focusWord={focusWord} />
    </Box>
  );
};

export default ChatBox;
