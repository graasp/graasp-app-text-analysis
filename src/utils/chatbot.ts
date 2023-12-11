import { ChatBotMessage, ChatbotRole } from '@graasp/sdk';

import { APP_DATA_TYPES } from '../config/appDataTypes';
import { ThreadMessage } from '../interfaces/chatbot';

// TODO: maybe it is possible to move to SDK and to reuse it in code-capsule
export const buildPrompt = (
  initialPrompt: string | undefined,
  threadMessages: ThreadMessage[],
  userMessage: string,
): Array<ChatBotMessage> => {
  // define the message to send to OpenAI with the initial prompt first if needed (role system).
  // Each call to OpenAI must contain the whole history of the messages.
  const finalPrompt: Array<ChatBotMessage> = initialPrompt
    ? [{ role: ChatbotRole.System, content: initialPrompt }]
    : [];

  threadMessages.forEach((msg) => {
    const msgRole =
      msg.type === APP_DATA_TYPES.BOT_COMMENT
        ? ChatbotRole.Assistant
        : ChatbotRole.User;
    finalPrompt.push({ role: msgRole, content: msg.data.content });
  });

  // add the last user's message in the prompt
  finalPrompt.push({ role: ChatbotRole.User, content: userMessage });

  return finalPrompt;
};
