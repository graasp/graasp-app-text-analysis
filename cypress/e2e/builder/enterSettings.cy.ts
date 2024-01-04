import { Context, PermissionLevel } from '@graasp/sdk';

import { KeywordsData } from '../../../src/config/appSettingTypes';
import {
  ADD_KEYWORD_BUTTON_CY,
  BUILDER_VIEW_CY,
  CHATBOT_CONTAINER_CY,
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_DEFINITION_FIELD_CY,
  ENTER_KEYWORD_FIELD_CY,
  INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY,
  INITIAL_PROMPT_INPUT_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
  SETTINGS_SAVE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  TITLE_INPUT_FIELD_CY,
  USE_CHATBOT_DATA_CY,
  buildDataCy,
} from '../../../src/config/selectors';
import {
  MOCK_APP_SETTINGS,
  MOCK_APP_SETTINGS_USING_CHATBOT,
  MOCK_INITIAL_CHATBOT_PROMPT_SETTING,
  MOCK_INITIAL_PROMPT_SETTING,
  MOCK_KEYWORDS_SETTING,
  MOCK_TEXT_RESOURCE_SETTING,
} from '../../fixtures/appSettings';

describe('Enter Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: [],
      },
      appContext: {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });

  it('show builder view', () => {
    cy.get(buildDataCy(BUILDER_VIEW_CY)).should('be.visible');
  });

  it('set title', () => {
    cy.get(buildDataCy(TITLE_INPUT_FIELD_CY))
      .should('be.visible')
      .type('Title');
    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).click();
    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('be.disabled');

    cy.get(buildDataCy(TITLE_INPUT_FIELD_CY)).type('New Title');
    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('not.be.disabled');
    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).click();
    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('be.disabled');

    // test that multiline is disabled, because it is rendered inline in player
    cy.get(buildDataCy(TITLE_INPUT_FIELD_CY)).type('{enter}');
    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('be.disabled');
  });

  it('set text', () => {
    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY))
      .should('be.visible')
      .type(
        'Lorem ipsum dolor sit amet. Ut optio laborum qui ducimus rerum eum illum possimus non quidem facere.',
      );

    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).click();

    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('be.disabled');

    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY)).type(
      'Quis ea quod necessitatibus sit voluptas culpa ut laborum quia ad nobis numquam.',
    );

    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('not.be.disabled');
  });

  it('set keywords', () => {
    cy.get(buildDataCy(ENTER_KEYWORD_FIELD_CY))
      .should('be.visible')
      .type('Lorem');

    cy.get(buildDataCy(ENTER_DEFINITION_FIELD_CY))
      .should('be.visible')
      .type('Latin');

    cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should('not.exist');

    cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY))
      .should('be.visible')
      .should('not.be.disabled')
      .click()
      .should('be.disabled');
    cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should('exist');

    cy.get(buildDataCy(DELETE_KEYWORD_BUTTON_CY)).should('be.visible').click();
    cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should('not.exist');
  });

  it('does not use chatbot (by default)', () => {
    cy.get(buildDataCy(USE_CHATBOT_DATA_CY)).should('not.be.checked');
    cy.get(buildDataCy(CHATBOT_CONTAINER_CY)).should('not.exist');
  });
});

describe('Load Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: MOCK_APP_SETTINGS_USING_CHATBOT,
      },
      appContext: {
        context: Context.Builder,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });

  it('display existing mock text resource', () => {
    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY)).should(
      'contain',
      MOCK_APP_SETTINGS.find(
        (appSetting) => appSetting === MOCK_TEXT_RESOURCE_SETTING,
      ).data.text,
    );

    cy.get(buildDataCy(INITIAL_PROMPT_INPUT_FIELD_CY)).should(
      'contain',
      MOCK_APP_SETTINGS.find(
        (appSetting) => appSetting === MOCK_INITIAL_PROMPT_SETTING,
      ).data.text,
    );

    cy.get(buildDataCy(INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY)).should(
      'contain',
      MOCK_APP_SETTINGS.find(
        (appSetting) => appSetting === MOCK_INITIAL_CHATBOT_PROMPT_SETTING,
      ).data.text,
    );

    const list = MOCK_APP_SETTINGS.find(
      (appSetting) => appSetting === MOCK_KEYWORDS_SETTING,
    ).data as KeywordsData;

    list.keywords.forEach((elem) => {
      cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should(
        'contain',
        `${elem.word} : ${elem.def}`,
      );
    });
  });
});
