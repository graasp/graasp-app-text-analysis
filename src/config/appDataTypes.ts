import { AppData } from '@graasp/sdk';

export enum AppDataTypes {
  STUDENT_COMMENT = 'student-comment',
  BOT_COMMENT = 'chatbot-comment',
}

export type MessageData = { message: string; keyword: string };
export type ChatAppData = AppData & { data: MessageData };
