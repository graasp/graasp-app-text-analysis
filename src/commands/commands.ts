/* eslint-disable max-classes-per-file */

type PostType = {
  action: 'post';
  name: string;
};

type PatchType = {
  action: 'patch';
  id: string;
};

type DeleteType = {
  action: 'delete';
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

export class HistoryCommand<T extends CommandDataType> extends Command<T> {
  private prevState;

  private currState;

  constructor({
    prevState,
    currState,
    apiContext,
  }: {
    prevState?: T;
    currState: T;
    apiContext: APIContext<T>;
  }) {
    super(apiContext);
    this.prevState = prevState;
    this.currState = currState;
  }

  // TODO: improve the way to chose post. patch and delete
  execute(): void {
    // check if it is the first data for the app
    if (this.currState.action === 'post') {
      this.apiContext.post(this.currState);
    } else {
      this.apiContext.patch(this.currState);
    }
  }

  undo(): void {
    if (!this.prevState) {
      this.apiContext.delete(this.currState);
    } else {
      this.apiContext.patch(this.prevState);
    }
  }

  getInfo(): string {
    return `Command ${JSON.stringify(this.currState)}`;
  }
}

// TODO: subclass to PostHistory, PatchHistory and DeleteHistory
export class HistoryManager<T extends CommandDataType> {
  private prevStates: Command<T>[] = [];

  private nextStates: Command<T>[] = [];

  public execute(command: Command<T>): void {
    this.nextStates = [];
    command.execute();
    this.prevStates = [...this.prevStates, command];
  }

  public redo(): void {
    if (!this.nextStates.length) return;

    const lastCommand = this.nextStates[this.nextStates.length - 1];
    lastCommand.execute();

    this.prevStates = [...this.prevStates, lastCommand];
    this.nextStates = this.nextStates.slice(0, -1);
  }

  public undo(): void {
    if (!this.prevStates.length) return;

    const lastCommand = this.prevStates[this.prevStates.length - 1];
    lastCommand.execute();

    this.nextStates = [...this.nextStates, lastCommand];
    this.prevStates = this.prevStates.slice(0, -1);
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
