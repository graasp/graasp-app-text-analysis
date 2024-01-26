import { useCallback, useEffect } from 'react';

const usePreventUnsavedChanges = (isChanged: boolean): void => {
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent): void => {
      if (isChanged) {
        event.preventDefault();
      }
    },
    [isChanged],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload, isChanged]);
};

export default usePreventUnsavedChanges;
