import { FC, useEffect, useState } from 'react';

import { Box, TextField } from '@mui/material';

import { TextResourceSetting } from '../../../config/appSettingTypes';
import { DEFAULT_TEXT_RESOURCE_SETTING } from '../../../config/appSettings';
import { DEFAULT_MARGIN, FULL_WIDTH } from '../../../config/stylingConstants';
import { useAppSettingContext } from '../../context/AppSettingContext';
import SaveButton from './SaveButton';

type Prop = {
  resourceKey: string;
  textFieldLabel: string;
  textDataCy: string;
  buttonDataCy: string;
};

const SetText: FC<Prop> = ({
  resourceKey,
  textFieldLabel,
  textDataCy,
  buttonDataCy,
}) => {
  const [resourceText, setResourceText] = useState(
    DEFAULT_TEXT_RESOURCE_SETTING.text,
  );
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  // This state is used to avoid to erase changes if another setting is saved.
  // This is due because the useQuery get all settings. So when a SetText update the setting
  // using mutations, all the settings are fetched again, causing the erase the current unsaved state.
  const [isClean, setIsClean] = useState(true);

  const onChange = ({ target }: { target: { value: string } }): void => {
    setResourceText(target.value);
    setIsClean(false);
  };

  const textResourceSetting = appSettingArray?.find(
    (s) => s.name === resourceKey,
  ) as TextResourceSetting;

  useEffect(() => {
    if (isClean) {
      const { text } =
        textResourceSetting?.data || DEFAULT_TEXT_RESOURCE_SETTING;
      setResourceText(text);
    }
  }, [isClean, textResourceSetting]);

  const handleClickSaveText = (): void => {
    if (textResourceSetting) {
      patchAppSetting({
        data: { text: resourceText },
        id: textResourceSetting.id,
      });
    } else {
      postAppSetting({ data: { text: resourceText }, name: resourceKey });
    }

    setIsClean(true);
  };

  return (
    <Box
      component="span"
      justifyContent="space-around"
      display="flex"
      alignItems="center"
      sx={{ margin: DEFAULT_MARGIN }}
    >
      <TextField
        data-cy={textDataCy}
        multiline
        label={textFieldLabel}
        variant="outlined"
        onChange={onChange}
        sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
        value={resourceText}
      />
      <SaveButton
        buttonDataCy={buttonDataCy}
        handleOnClick={handleClickSaveText}
        marginRight={DEFAULT_MARGIN}
        minHeight="55px"
        disabled={
          (textResourceSetting?.data || DEFAULT_TEXT_RESOURCE_SETTING).text ===
          resourceText
        }
      />
    </Box>
  );
};

export default SetText;
