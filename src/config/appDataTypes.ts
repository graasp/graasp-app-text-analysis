enum APP_DATA_TYPES {
  STUDENT_COMMENT = 'Student',
  BOT_COMMENT = 'Chatbot',
}

enum APP_DATA_VISIBILITY {
  MEMBER = 'member',
  ITEM = 'item',
}

export type MessageData = { message: string; keyword: string };

export { APP_DATA_TYPES, APP_DATA_VISIBILITY };
