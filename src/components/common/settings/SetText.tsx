import { FC, useEffect, useState } from 'react';

import { Box, TextField } from '@mui/material';

import { TextResourceSetting } from '../../../config/appSettingTypes';
import { DEFAULT_TEXT_RESOURCE_SETTING } from '../../../config/appSettings';
import { DEFAULT_MARGIN, FULL_WIDTH } from '../../../config/stylingConstants';
import { useAppSettingContext } from '../../context/AppSettingContext';
import { useObserver } from '../../context/ObserverContext';

type Prop = {
  resourceKey: string;
  textFieldLabel: string;
  textDataCy: string;

  multiline?: boolean;
  minRows?: number;
  onTextChange?: (text: string, hasChanged: boolean) => void;
};

const SetText: FC<Prop> = ({
  resourceKey,
  textFieldLabel,
  textDataCy,
  multiline = false,
  minRows = 1,
  onTextChange,
}) => {
  const { subscribe, unsubscribe } = useObserver();

  const [resourceText, setResourceText] = useState(
    DEFAULT_TEXT_RESOURCE_SETTING.text,
  );
  const { patchAppSetting, postAppSetting, deleteAppSetting, appSettingArray } =
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

  useEffect(() => {
    if (onTextChange) {
      const hasChanged =
        (textResourceSetting?.data || DEFAULT_TEXT_RESOURCE_SETTING).text !==
        resourceText;
      onTextChange(resourceText, hasChanged);
    }
    // Here, we want to listen on resourceText changes only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceText]);

  useEffect(() => {
    const handleParentButtonClick = (): void => {
      if (textResourceSetting) {
        const payloadAppSetting = {
          data: { text: resourceText },
          id: textResourceSetting.id,
        };
        if (resourceText) {
          patchAppSetting(payloadAppSetting);
        } else {
          deleteAppSetting(payloadAppSetting);
        }
      } else {
        postAppSetting({ data: { text: resourceText }, name: resourceKey });
      }

      setIsClean(true);
    };

    subscribe(handleParentButtonClick);

    return () => {
      unsubscribe(handleParentButtonClick);
    };
  }, [
    deleteAppSetting,
    patchAppSetting,
    postAppSetting,
    resourceKey,
    resourceText,
    subscribe,
    textResourceSetting,
    unsubscribe,
  ]);

  return (
    <Box
      component="span"
      justifyContent="space-around"
      display="flex"
      alignItems="flex-end"
      sx={{ margin: DEFAULT_MARGIN }}
    >
      <TextField
        data-cy={textDataCy}
        multiline={multiline}
        label={textFieldLabel}
        variant="outlined"
        onChange={onChange}
        sx={{ width: FULL_WIDTH, marginRight: DEFAULT_MARGIN }}
        value={resourceText}
        minRows={minRows}
      />
    </Box>
  );
};

export default SetText;
