import { FC, ReactElement, useEffect, useState } from 'react';

import { Box } from '@mui/material';

import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  KEYWORDS_SETTING_KEY,
  KeywordsData,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
  TextResourceData,
  USE_CHATBOT_SETTING_KEY,
  UseChatbotData,
  keyword,
} from '../../../config/appSettingTypes';
import {
  DEFAULT_KEYWORD,
  DEFAULT_KEYWORDS_LIST,
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
  DEFAULT_USE_CHATBOT_SETTING,
} from '../../../config/appSettings';
import { FIRST_CHATBOT_MESSAGE } from '../../../config/constants';
import { PLAYER_VIEW_CY } from '../../../config/selectors';
import { FULL_WIDTH } from '../../../config/stylingConstants';
import ChatbotWindow from '../../common/chat/ChatbotWindow';
import Banner from '../../common/display/Banner';
import TextDisplay from '../../common/display/TextDisplay';
import { useAppDataContext } from '../../context/AppDataContext';
import { useAppSettingContext } from '../../context/AppSettingContext';

const PlayerView: FC = () => {
  const { appSettingArray } = useAppSettingContext();
  const { appDataArray, postAppData, deleteAppData } = useAppDataContext();

  const [summon, setSummon] = useState(false);
  const [chatbot, setChatbot] = useState(false);
  const [useChatbot, setUseChatbot] = useState(false);
  const [focusWord, setFocusWord] = useState<keyword>(DEFAULT_KEYWORD);

  const { keywords } = (appSettingArray.find(
    (s) => s.name === KEYWORDS_SETTING_KEY,
  )?.data || DEFAULT_KEYWORDS_LIST) as KeywordsData;

  const useChatbotSetting = (appSettingArray.find(
    (s) => s.name === USE_CHATBOT_SETTING_KEY,
  )?.data || DEFAULT_USE_CHATBOT_SETTING) as UseChatbotData;

  const keywordAppData = appDataArray.filter(
    (data) => data.data.keyword === focusWord.word,
  );

  useEffect(() => {
    setUseChatbot(useChatbotSetting.useBot);
  }, [useChatbotSetting]);

  const fetchSetting = (
    key: string,
    defaultSetting: TextResourceData,
  ): TextResourceData => {
    const setting = (appSettingArray.find((s) => s.name === key)?.data ||
      defaultSetting) as TextResourceData;
    return setting;
  };

  const textResource = fetchSetting(
    TEXT_RESOURCE_SETTING_KEY,
    DEFAULT_TEXT_RESOURCE_SETTING,
  ).text;

  const openChatbot = (word: keyword): void => {
    setChatbot(true);
    setFocusWord(word);
  };

  useEffect(() => {
    const initialChatbotPrompt = (
      (appSettingArray.find(
        (s) => s.name === INITIAL_CHATBOT_PROMPT_SETTING_KEY,
      )?.data || FIRST_CHATBOT_MESSAGE) as TextResourceData
    ).text.replaceAll('{{keyword}}', `**${focusWord.word}**`);

    if (keywordAppData.size === 0) {
      postAppData({
        data: { message: initialChatbotPrompt, keyword: focusWord.word },
        type: APP_DATA_TYPES.BOT_COMMENT,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusWord, keywordAppData]);

  const onDeleteClick = (): void => {
    keywordAppData?.map(({ id }) => deleteAppData({ id }));
  };

  const renderContent = (): ReactElement => {
    if (chatbot) {
      return (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <TextDisplay
            text={textResource}
            keywords={keywords}
            highlight={summon}
            openChatbot={openChatbot}
            width={FULL_WIDTH}
          />
          <ChatbotWindow
            closeChatbot={() => setChatbot(false)}
            focusWord={focusWord}
            useChatbot={useChatbot}
            isOpen={chatbot}
            onDelete={onDeleteClick}
          />
        </Box>
      );
    }
    return (
      <TextDisplay
        text={textResource}
        keywords={keywords}
        highlight={summon}
        openChatbot={openChatbot}
      />
    );
  };

  return (
    <div data-cy={PLAYER_VIEW_CY}>
      <Banner
        title={
          fetchSetting(LESSON_TITLE_SETTING_KEY, DEFAULT_LESSON_TITLE).text
        }
        onSummonClick={() => {
          setSummon(true);
        }}
        buttonDisable={
          textResource === '' || keywords.length === 0 || summon === true
        }
      />
      {renderContent()}
    </div>
  );
};

export default PlayerView;
