/* eslint-disable max-classes-per-file */
import { SettingKey, SettingValue } from '@/components/views/admin/types';

interface PostType {
  name: string;
}

interface PatchType {
  id: string;
}

interface DeleteType {
  // depending on the implementation, the id may be undefined in the command.
  id?: string;
}

export type CommandDataType<T = PostType | PatchType | DeleteType> = {
  settingKey: SettingKey;
  data: { [key: string]: SettingValue };
} & T;

export type PostCommandDataType = CommandDataType<PostType>;

export type PatchCommandDataType = CommandDataType<PatchType>;

export type DeleteCommandDataType = CommandDataType<DeleteType>;

export interface CommandContext<T> {
  update(data: T): void;
  create(data: T): void;
  delete(data: T): void;
}

export abstract class Command<T> {
  protected commandContext;

  protected currState;

  constructor({
    currState,
    commandContext,
  }: {
    currState: T;
    commandContext: CommandContext<T>;
  }) {
    this.commandContext = commandContext;
    this.currState = currState;
  }

  abstract execute(): void;

  abstract undo(): void;

  getInfo(): string {
    return `Command ${JSON.stringify(this.currState)}`;
  }
}

export class CreateCommand<T> extends Command<T> {
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

  undo(): void {
    this.commandContext.delete(this.currState);
  }
}

export class UpdateCommand<T> extends Command<T> {
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
