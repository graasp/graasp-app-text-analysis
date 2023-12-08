import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

interface ObserverContextProps {
  subscribe: (callback: () => void) => void;
  unsubscribe: (callback: () => void) => void;
  notifySubscribers: () => void;
}

const ObserverContext = createContext<ObserverContextProps | undefined>(
  undefined,
);

interface ObserverProviderProps {
  children: ReactNode;
}

/**
 * This provider allow to a parent component to notify its children components.
 * It is useful when a button is in the parent, but the children have to do something.
 */
export const ObserverProvider: React.FC<ObserverProviderProps> = ({
  children,
}) => {
  const [subscribers, setSubscribers] = useState<(() => void)[]>([]);

  const contextValue = useMemo(() => {
    const subscribe: ObserverContextProps['subscribe'] = (callback) => {
      setSubscribers((prevSubscribers) => [...prevSubscribers, callback]);
    };

    const unsubscribe: ObserverContextProps['unsubscribe'] = (callback) => {
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((subscriber) => subscriber !== callback),
      );
    };

    const notifySubscribers: ObserverContextProps['notifySubscribers'] = () => {
      subscribers.forEach((subscriber) => subscriber());
    };

    return { subscribe, unsubscribe, notifySubscribers };
  }, [subscribers]);

  return (
    <ObserverContext.Provider value={contextValue}>
      {children}
    </ObserverContext.Provider>
  );
};

export const useObserver = (): ObserverContextProps => {
  const context = useContext(ObserverContext);

  if (!context) {
    throw new Error('useObserver must be used within an ObserverProvider');
  }

  return context;
};
