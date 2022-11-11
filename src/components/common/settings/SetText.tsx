import { FC, useState } from 'react';

import { Box, TextField } from '@mui/material';

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
  const [resourceText, setResourceText] = useState('');
  const { patchAppSetting, postAppSetting, appSettingArray } =
    useAppSettingContext();

  const onChange = ({ target }: { target: { value: string } }): void => {
    setResourceText(target.value);
  };

  const handleClickSaveText = (name: string, value: string): void => {
    const textResourceSetting = appSettingArray.find((s) => s.name === name);

    if (textResourceSetting) {
      patchAppSetting({ data: { text: value }, id: textResourceSetting.id });
    } else {
      postAppSetting({ data: { text: value }, name });
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
