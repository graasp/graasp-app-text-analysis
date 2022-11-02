import { FC, useState } from 'react';

import {
  KEYWORDS_KEY,
  LESSON_TITLE_KEY,
  TEXT_RESOURCE_KEY,
} from '../../../config/appSettingTypes';
import {
  DEFAULT_KEYWORDS_LIST,
  DEFAULT_LESSON_TITLE,
  DEFAULT_TEXT_RESOURCE_SETTING,
} from '../../../config/appSettings';
import { PLAYER_VIEW_CY } from '../../../config/selectors';
import Banner from '../../Banner';
import TextDisplay from '../../TextDisplay';
import { useAppSettingContext } from '../../context/AppSettingContext';

type textSetting = { text: string };
type keywordsSetting = { keywords: string[] };

const PlayerView: FC = () => {
  const { appSettingArray } = useAppSettingContext();
  const [summon, setSummon] = useState(false);

  const fetchSetting = (
    key: string,
    defaultSetting: textSetting,
  ): textSetting => {
    const setting = (appSettingArray.find((s) => s.name === key)?.data ||
      defaultSetting) as textSetting;
    return setting;
  };

  const keywords = (appSettingArray.find((s) => s.name === KEYWORDS_KEY)
    ?.data || DEFAULT_KEYWORDS_LIST) as keywordsSetting;

  const textResource = fetchSetting(
    TEXT_RESOURCE_KEY,
    DEFAULT_TEXT_RESOURCE_SETTING,
  ).text;

  return (
    <div data-cy={PLAYER_VIEW_CY}>
      <Banner
        title={fetchSetting(LESSON_TITLE_KEY, DEFAULT_LESSON_TITLE).text}
        onSummonClick={() => {
          setSummon(true);
        }}
        buttonDisable={textResource === ''}
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
