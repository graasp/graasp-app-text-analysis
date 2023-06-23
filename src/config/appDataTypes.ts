import { AppData } from '@graasp/sdk';
import { ImmutableCast } from '@graasp/sdk/frontend';

enum APP_DATA_TYPES {
  STUDENT_COMMENT = 'student-comment',
  BOT_COMMENT = 'chatbot-comment',
}

enum APP_DATA_VISIBILITY {
  MEMBER = 'member',
  ITEM = 'item',
}

export type MessageData = { message: string; keyword: string };
export type ChatAppData = AppData & { data: MessageData };
export type ChatAppDataRecord = ImmutableCast<ChatAppData>;

export { APP_DATA_TYPES, APP_DATA_VISIBILITY };
