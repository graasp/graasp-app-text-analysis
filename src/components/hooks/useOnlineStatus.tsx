import { useEffect, useState } from 'react';

// This effect allows to detect when the client is offline.
export const useOnlineStatus = (): boolean => {
  const [online, setOnline] = useState(
    typeof window !== 'undefined' ? window.navigator.onLine : true,
  );

  useEffect(() => {
    const handleStatusChange = (): void => {
      setOnline(navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return online;
};
