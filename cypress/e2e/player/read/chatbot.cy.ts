import { Context, PermissionLevel } from '@graasp/sdk';

import {
  CHATBOT_MODE_CY,
  CHAT_WINDOW_CY,
  SHOW_KEYWORDS_BUTTON_CY,
  buildDataCy,
  keywordDataCy,
} from '../../../../src/config/selectors';
import { MOCK_APP_SETTINGS_USING_CHATBOT } from '../../../fixtures/appSettings';

describe('Empty App Data and chatbot prompt setting', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: MOCK_APP_SETTINGS_USING_CHATBOT,
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('show the default behaviour', () => {
    cy.get(buildDataCy(CHAT_WINDOW_CY)).should('not.exist');
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY)).click();
    cy.get(buildDataCy(keywordDataCy('lorem')))
      .should('be.visible')
      .click();
    cy.get(buildDataCy(CHAT_WINDOW_CY)).should('be.visible');
    cy.get(buildDataCy(CHATBOT_MODE_CY)).should('be.visible');
  });
});
