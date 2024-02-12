import { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import { TEXT_ANALYSIS } from '@/langs/constants';

import { APP_DATA_TYPES } from '../../../config/appDataTypes';
import {
  INITIAL_CHATBOT_PROMPT_SETTING_KEY,
  KEYWORDS_SETTING_KEY,
  Keyword,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
  USE_CHATBOT_SETTING_KEY,
} from '../../../config/appSettingTypes';
import {
  DEFAULT_KEYWORD,
  DEFAULT_KEYWORDS_LIST,
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
  DEFAULT_USE_CHATBOT_SETTING,
} from '../../../config/appSettings';
import { PLAYER_VIEW_CY } from '../../../config/selectors';
import { getDataAppSetting } from '../../../utils/appSettings';
import PublicAlert from '../../common/PublicAlert';
import ChatbotWindow from '../../common/chat/ChatbotWindow';
import Banner from '../../common/display/Banner';
import TextDisplay from '../../common/display/TextDisplay';
import { useAppDataContext } from '../../context/AppDataContext';
import { useAppSettingContext } from '../../context/AppSettingContext';

const PlayerView: FC = () => {
  const { t } = useTranslation();
  const { appSettingArray } = useAppSettingContext();
  const { appDataArray, postAppData, deleteAppData } = useAppDataContext();

  const [summon, setSummon] = useState(false);
  const [chatbot, setChatbot] = useState(false);
  const [useChatbot, setUseChatbot] = useState(false);
  const [focusWord, setFocusWord] = useState<Keyword>(DEFAULT_KEYWORD);

  const { keywords } = getDataAppSetting(
    appSettingArray,
    KEYWORDS_SETTING_KEY,
    'keywords',
    DEFAULT_KEYWORDS_LIST,
  );

  const useChatbotSetting = getDataAppSetting(
    appSettingArray,
    USE_CHATBOT_SETTING_KEY,
    'useBot',
    DEFAULT_USE_CHATBOT_SETTING,
  );

  const keywordAppData = appDataArray.filter(
    (data) => data.data.keyword === focusWord.word,
  );

  useEffect(() => {
    setUseChatbot(useChatbotSetting.useBot);
  }, [useChatbotSetting]);

  const textResource = getDataAppSetting(
    appSettingArray,
    TEXT_RESOURCE_SETTING_KEY,
    'text',
    DEFAULT_TEXT_RESOURCE_SETTING,
  ).text;

  const openChatbot = (word: Keyword): void => {
    setChatbot(true);
    setFocusWord(word);
  };

  useEffect(() => {
    const initialChatbotPrompt = getDataAppSetting(
      appSettingArray,
      INITIAL_CHATBOT_PROMPT_SETTING_KEY,
      'text',
      { text: t(TEXT_ANALYSIS.FIRST_CHATBOT_MESSAGE) },
    ).text.replaceAll('{{keyword}}', `**${focusWord.word}**`);

    if (keywordAppData.length === 0) {
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
            width="100%"
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
      <PublicAlert />
      <Banner
        title={
          getDataAppSetting(
            appSettingArray,
            LESSON_TITLE_SETTING_KEY,
            'text',
            DEFAULT_LESSON_TITLE,
          ).text
        }
        onClick={(showKeywords) => setSummon(showKeywords)}
        disabled={textResource === '' || keywords.length === 0}
      />
      {renderContent()}
    </div>
  );
};

export default PlayerView;
