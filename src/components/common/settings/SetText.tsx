import { FC, useEffect, useState } from 'react';

import { Box, TextField } from '@mui/material';

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

  const onChange = ({ target }: { target: { value: string } }): void => {
    setResourceText(target.value);
  };
  const textResourceSetting = appSettingArray.find(
    (s) => s.name === resourceKey,
  );

  useEffect(() => {
    const text = (textResourceSetting?.data || DEFAULT_TEXT_RESOURCE_SETTING)
      .text as string;
    setResourceText(text);
  }, [textResourceSetting]);

  const handleClickSaveText = (): void => {
    if (textResourceSetting) {
      patchAppSetting({
        data: { text: resourceText },
        id: textResourceSetting.id,
      });
    } else {
      postAppSetting({ data: { text: resourceText }, name: resourceKey });
    }
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
      />
      <SaveButton
        buttonDataCy={buttonDataCy}
        handleOnClick={() => handleClickSaveText(resourceKey, resourceText)}
        marginRight={DEFAULT_MARGIN}
        minHeight="55px"
      />
    </Box>
  );
};

export default SetText;
