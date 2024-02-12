import { useState } from 'react';

import { Command } from './commands';

export type UseHistoryManager<T> = {
  execute: (command: Command<T>) => void;
  redo: () => void;
  undo: () => void;
  hasNextCommand: () => boolean;
  hasPrevCommand: () => boolean;
};

export const useHistoryManager = <T,>(): UseHistoryManager<T> => {
  const [prevStates, setPrevStates] = useState<Command<T>[]>([]);
  const [nextStates, setNextStates] = useState<Command<T>[]>([]);

  const execute = (command: Command<T>): void => {
    setNextStates([]);
    command.execute();
    setPrevStates((prev) => [...prev, command]);
  };

  const redo = (): void => {
    if (!nextStates.length) return;

    const lastCommand = nextStates[nextStates.length - 1];
    lastCommand.execute();

    setPrevStates((prev) => [...prev, lastCommand]);
    setNextStates((prev) => prev.slice(0, -1));
  };

  const undo = (): void => {
    if (!prevStates.length) return;

    const lastCommand = prevStates[prevStates.length - 1];
    lastCommand.undo();

    setNextStates((prev) => [...prev, lastCommand]);
    setPrevStates((prev) => prev.slice(0, -1));
  };

  const hasNextCommand = (): boolean => nextStates.length > 0;

  const hasPrevCommand = (): boolean => prevStates.length > 0;

  return {
    execute,
    redo,
    undo,
    hasNextCommand,
    hasPrevCommand,
  };
};
