import { APP_DATA_TYPES } from '../config/appDataTypes';

// TODO: there is something similar in app-code-capsule, it may be intersting to move in SDK ?
export interface ThreadMessage {
  type: APP_DATA_TYPES.BOT_COMMENT | APP_DATA_TYPES.STUDENT_COMMENT;
  data: {
    content: string;
  };
}
