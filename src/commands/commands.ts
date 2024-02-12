/* eslint-disable max-classes-per-file */

type PostType = {
  name: string;
};

type PatchType = {
  id: string;
};

type DeleteType = {
  id: string;
};

export type CommandDataType = {
  data: { [key: string]: unknown };
} & (PostType | PatchType | DeleteType);

export type PostCommandDataType = {
  data: { [key: string]: unknown };
} & PostType;

export type PatchCommandDataType = {
  data: { [key: string]: unknown };
} & PatchType;

export type DeleteCommandDataType = {
  data: { [key: string]: unknown };
} & DeleteType;

export interface CommandContext<T> {
  update(data: T): void;
  create(data: T): void;
  delete(data: T): void;
}

export abstract class Command<T> {
  protected commandContext: CommandContext<T>;

  constructor(commandContext: CommandContext<T>) {
    this.commandContext = commandContext;
  }

  abstract execute(): void;

  abstract undo(): void;

  abstract getInfo(): string;
}

type FormattedCommand<T> = {
  type: string;
  command: Command<T>;
  message: string;
};

export abstract class HistoryCommand<T> extends Command<T> {
  protected currState;

  constructor({
    currState,
    commandContext,
  }: {
    currState: T;
    commandContext: CommandContext<T>;
  }) {
    super(commandContext);
    this.currState = currState;
  }

  abstract execute(): void;

  abstract undo(): void;

  getInfo(): string {
    return `Command ${JSON.stringify(this.currState)}`;
  }
}

export class CreateCommand<T> extends HistoryCommand<T> {
  constructor({
    currState,
    commandContext,
  }: {
    currState: T;
    commandContext: CommandContext<T>;
  }) {
    super({ currState, commandContext });
  }

  execute(): void {
    this.commandContext.create(this.currState);
  }

  // TODO: if create command, there is no id... so it is not possible to delete or patch anything
  undo(): void {
    this.commandContext.delete(this.currState);
  }
}

export class UpdateCommand<T> extends HistoryCommand<T> {
  protected prevState;

  constructor({
    currState,
    prevState,
    commandContext,
  }: {
    currState: T;
    prevState: T;
    commandContext: CommandContext<T>;
  }) {
    super({ currState, commandContext });
    this.prevState = prevState;
  }

  execute(): void {
    this.commandContext.update(this.currState);
  }

  undo(): void {
    this.commandContext.update(this.prevState);
  }
}

export class DeleteCommand<T> extends HistoryCommand<T> {
  constructor({
    currState,
    commandContext,
  }: {
    currState: T;
    commandContext: CommandContext<T>;
  }) {
    super({ currState, commandContext });
  }

  execute(): void {
    this.commandContext.delete(this.currState);
  }

  undo(): void {
    this.commandContext.create(this.currState);
  }
}

export enum HistoryEvent {
  UNDO = 'undo',
  REDO = 'redo',
}

export interface HistoryObserver {
  onChange: (event: `${HistoryEvent}`) => void;
}

export class HistoryManager<T> {
  private prevStates: Command<T>[] = [];

  private nextStates: Command<T>[] = [];

  private subscribers: HistoryObserver[] = [];

  public execute(command: Command<T>): void {
    this.nextStates = [];
    command.execute();
    this.prevStates = [...this.prevStates, command];
  }

  public subscribe(observer: HistoryObserver): void {
    if (!this.subscribers.includes(observer)) {
      this.subscribers.push(observer);
    }
  }

  public unSubscribe(observer: HistoryObserver): void {
    if (this.subscribers.includes(observer)) {
      this.subscribers = this.subscribers.filter((o) => o !== observer);
    }
  }

  public redo(): void {
    if (!this.nextStates.length) return;

    const lastCommand = this.nextStates[this.nextStates.length - 1];
    lastCommand.execute();

    this.prevStates = [...this.prevStates, lastCommand];
    this.nextStates = this.nextStates.slice(0, -1);

    this.subscribers.forEach((s) => s.onChange(HistoryEvent.REDO));
  }

  public undo(): void {
    if (!this.prevStates.length) return;

    const lastCommand = this.prevStates[this.prevStates.length - 1];
    lastCommand.undo();

    this.nextStates = [...this.nextStates, lastCommand];
    this.prevStates = this.prevStates.slice(0, -1);

    this.subscribers.forEach((s) => s.onChange(HistoryEvent.UNDO));
  }

  public formattedBackHistory(): FormattedCommand<T>[] {
    return this.prevStates.map((command) => ({
      type: 'undo',
      command,
      message: command.getInfo(),
    }));
  }

  public formattedForwardHistory(): FormattedCommand<T>[] {
    return [...this.nextStates].reverse().map((command) => ({
      type: 'redo',
      command,
      message: command.getInfo(),
    }));
  }
}
