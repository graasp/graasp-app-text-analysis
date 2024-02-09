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

export interface APIContext<T> {
  patch(data: T): void;
  post(data: T): void;
  delete(data: T): void;
}

export abstract class Command<T> {
  protected apiContext: APIContext<T>;

  constructor(apiContext: APIContext<T>) {
    this.apiContext = apiContext;
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
    apiContext,
  }: {
    currState: T;
    apiContext: APIContext<T>;
  }) {
    super(apiContext);
    this.currState = currState;
  }

  abstract execute(): void;

  abstract undo(): void;

  getInfo(): string {
    return `Command ${JSON.stringify(this.currState)}`;
  }
}

export class CreateCommand<
  T extends CommandDataType,
> extends HistoryCommand<T> {
  constructor({
    currState,
    apiContext,
  }: {
    currState: T;
    apiContext: APIContext<T>;
  }) {
    super({ currState, apiContext });
  }

  execute(): void {
    this.apiContext.post(this.currState);
  }

  // TODO: if create command, there is no id... so it is not possible to delete or patch anything
  undo(): void {
    this.apiContext.delete(this.currState);
  }
}

export class UpdateCommand<
  T extends CommandDataType,
> extends HistoryCommand<T> {
  protected prevState;

  constructor({
    currState,
    prevState,
    apiContext,
  }: {
    currState: T;
    prevState: T;
    apiContext: APIContext<T>;
  }) {
    super({ currState, apiContext });
    this.prevState = prevState;
  }

  execute(): void {
    this.apiContext.patch(this.currState);
  }

  undo(): void {
    this.apiContext.patch(this.prevState);
  }
}

export class DeleteCommand<
  T extends CommandDataType,
> extends HistoryCommand<T> {
  constructor({
    currState,
    apiContext,
  }: {
    currState: T;
    apiContext: APIContext<T>;
  }) {
    super({ currState, apiContext });
  }

  execute(): void {
    this.apiContext.delete(this.currState);
  }

  undo(): void {
    this.apiContext.post(this.currState);
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
