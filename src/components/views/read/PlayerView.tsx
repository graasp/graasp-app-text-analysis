import { FC, ReactElement, useState } from 'react';

import { Box } from '@mui/material';

import {
  KEYWORDS_SETTING_KEY,
  KeywordsData,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
  TextResourceData,
  keyword,
} from '../../../config/appSettingTypes';
import {
  DEFAULT_KEYWORD,
  DEFAULT_KEYWORDS_LIST,
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
} from '../../../config/appSettings';
// import { DICTIONARY_API_BASE_URL } from '../../../config/constants';
import { PLAYER_VIEW_CY } from '../../../config/selectors';
import { FULL_WIDTH } from '../../../config/stylingConstants';
import ChatbotWindow from '../../common/ChatbotWindow';
import Banner from '../../common/display/Banner';
import TextDisplay from '../../common/display/TextDisplay';
import { useAppSettingContext } from '../../context/AppSettingContext';

const PlayerView: FC = () => {
  const { appSettingArray } = useAppSettingContext();
  const [summon, setSummon] = useState(false);
  // const [dictionary, setDictionary] = useState({});
  const [chatbot, setChatbot] = useState(false);
  const [focusWord, setFocusWord] = useState<keyword>(DEFAULT_KEYWORD);

  const { keywords } = (appSettingArray.find(
    (s) => s.name === KEYWORDS_SETTING_KEY,
  )?.data || DEFAULT_KEYWORDS_LIST) as KeywordsData;
  /* 
  const uniqueKeywords = keywords.reduce(
    (acc: keyword[], currentVal: keyword): keyword[] =>
      acc.some((k) => k.word === currentVal.word) ? acc : [...acc, currentVal],
    [],
  );
  
  const fetchKeywordDef = async (word: string): Promise<string> => {
    const response = await fetch(`${DICTIONARY_API_BASE_URL}${word}`);
    const json = await response.json();
    return json[0].meanings[0].definitions.map(
      ({ definition, example }: { definition: string; example: string }) => ({
        definition,
        example,
      }),
    );
  };

  useEffect(() => {
    if (summon) {
      uniqueKeywords.forEach((word) => {
        fetchKeywordDef(word)
          .then((def) => {
            setDictionary((prevDict) => ({ ...prevDict, [word]: def }));
          })
          .catch(() => setDictionary({ ...dictionary, [word]: DEFAULT_DEF }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summon, keywords]);
*/
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
            openChatbot={(word: keyword) => {
              setChatbot(true);
              setFocusWord(word);
            }}
            width={FULL_WIDTH}
          />
          <ChatbotWindow
            closeChatbot={() => setChatbot(false)}
            focusWord={focusWord}
          />
        </Box>
      );
    }
    return (
      <TextDisplay
        text={textResource}
        keywords={keywords}
        highlight={summon}
        openChatbot={(word: keyword) => {
          setChatbot(true);
          setFocusWord(word);
        }}
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
