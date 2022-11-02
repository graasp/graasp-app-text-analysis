import { FC, useState } from 'react';

import { Box, Button, TextField } from '@mui/material';

import { useAppSettingContext } from './context/AppSettingContext';

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
      sx={{ margin: '25px' }}
    >
      <TextField
        data-cy={textDataCy}
        multiline
        label={textFieldLabel}
        variant="outlined"
        onChange={onChange}
        sx={{ width: '100%', marginRight: '25px' }}
      />
      <Button
        data-cy={buttonDataCy}
        variant="contained"
        sx={{
          marginRight: '25px',
          backgroundColor: '#5050d2',
          minHeight: '55px',
        }}
        onClick={() => handleClickSaveText(resourceKey, resourceText)}
      >
        Save
      </Button>
    </Box>
  );
};

export default SetText;
