import { FC, useEffect, useState } from 'react';

import {
  KEYWORDS_SETTING_KEY,
  LESSON_TITLE_SETTING_KEY,
  TEXT_RESOURCE_SETTING_KEY,
} from '../../../config/appSettingTypes';
import {
  DEFAULT_KEYWORDS_LIST,
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
} from '../../../config/appSettings';
import { PLAYER_VIEW_CY } from '../../../config/selectors';
import Banner from '../../common/display/Banner';
import TextDisplay from '../../common/display/TextDisplay';
import { useAppSettingContext } from '../../context/AppSettingContext';

type textSetting = { text: string };
type keywordsSetting = { keywords: string[] };

const DICTIONARY_API_BASE_URL =
  'https://api.dictionaryapi.dev/api/v2/entries/en/';

const PlayerView: FC = () => {
  const { appSettingArray } = useAppSettingContext();
  const [summon, setSummon] = useState(false);
  const [dictionary, setDictionary] = useState(new Map<string, string>());

  const keywords = (appSettingArray.find((s) => s.name === KEYWORDS_KEY)
    ?.data || DEFAULT_KEYWORDS_LIST) as keywordsSetting;

  const fetchKeywordDef = async (word: string): Promise<string> => {
    const response = await fetch(DICTIONARY_API_BASE_URL + word);
    const json = await response.json();
    return json[0].meanings[0].definitions[0];
  };

  useEffect(() => {
    console.log('In useEffect');
    if (summon) {
      keywords.keywords.forEach((word) => {
        fetchKeywordDef(word).then((def) =>
          setDictionary(dictionary.set(word, def)),
        );
      });
    }
  }, [summon, keywords]);

  const fetchSetting = (
    key: string,
    defaultSetting: textSetting,
  ): textSetting => {
    const setting = (appSettingArray.find((s) => s.name === key)?.data ||
      defaultSetting) as textSetting;
    return setting;
  };

  const keywords = (appSettingArray.find((s) => s.name === KEYWORDS_SETTING_KEY)
    ?.data || DEFAULT_KEYWORDS_LIST) as keywordsSetting;

  const textResource = fetchSetting(
    TEXT_RESOURCE_SETTING_KEY,
    DEFAULT_TEXT_RESOURCE_SETTING,
  ).text;

  return (
    <div data-cy={PLAYER_VIEW_CY}>
      <Banner
        title={
          fetchSetting(LESSON_TITLE_SETTING_KEY, DEFAULT_LESSON_TITLE).text
        }
        onSummonClick={() => {
          setSummon(true);
        }}
        buttonDisable={textResource === '' || keywords.keywords.length === 0}
      />
      <TextDisplay
        text={textResource}
        keywords={keywords.keywords}
        highlight={summon}
      />
    </div>
  );
};

export default PlayerView;
