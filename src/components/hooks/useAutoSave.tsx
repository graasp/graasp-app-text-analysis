import debounce from 'lodash.debounce';

import { useEffect, useRef } from 'react';

const AUTO_SAVE_DEBOUNCE_MS = 700;
const REFRESH_SAVE_TIME_MS = 20_000;

export interface DebouncedFunction {
  (): void;
  cancel(): void;
}

type UseAutoSaveType = {
  updateSaveTimeToNow: () => void;
  debounceSaveSetting: ({
    settingKey,
    saveCallBack,
  }: {
    settingKey: string;
    saveCallBack: () => void;
  }) => void;
};

type UseAutoSaveProps = {
  onRefreshLastSaved?: (lastTime: Date) => void;
};

export const useAutoSave = ({
  onRefreshLastSaved,
}: UseAutoSaveProps): UseAutoSaveType => {
  const lastSavedTime = useRef<Date>();

  // This map is used to manage the auto save of each setting.
  const autoSaveDebounceMap = useRef(new Map<string, DebouncedFunction>());

  // This useEffect is used to refresh the last saved time periodically.
  useEffect(() => {
    const interval = setInterval(() => {
      const lastTime = lastSavedTime.current;
      if (lastTime) {
        onRefreshLastSaved?.(lastTime);
      }
    }, REFRESH_SAVE_TIME_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSavedTime.current]);

  const debounceSaveSetting = ({
    settingKey,
    saveCallBack,
  }: {
    settingKey: string;
    saveCallBack: () => void;
  }): void => {
    autoSaveDebounceMap.current.get(settingKey)?.cancel();
    const newDebounce = debounce(() => saveCallBack(), AUTO_SAVE_DEBOUNCE_MS);
    autoSaveDebounceMap.current.set(settingKey, newDebounce);
    newDebounce();
  };

  const updateSaveTimeToNow = (): void => {
    lastSavedTime.current = new Date();
  };

  return {
    debounceSaveSetting,
    updateSaveTimeToNow,
  };
};
