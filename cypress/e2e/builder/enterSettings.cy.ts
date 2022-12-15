import { Context, PermissionLevel } from '@graasp/sdk';

import { KeywordsData } from '../../../src/config/appSettingTypes';
import {
  BUILDER_VIEW_CY,
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_KEYWORD_FIELD_CY,
  INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY,
  INITIAL_PROMPT_INPUT_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
  SAVE_KEYWORDS_BUTTON_CY,
  SAVE_TEXT_BUTTON_CY,
  SAVE_TITLE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  TITLE_INPUT_FIELD_CY,
  USE_CHATBOT_DATA_CY,
  buildDataCy,
} from '../../../src/config/selectors';
import { MOCK_APP_SETTINGS } from '../../fixtures/appSettings';

describe('Enter Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: [],
      },
      appContext: {
        context: Context.BUILDER,
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

    cy.get(buildDataCy(SAVE_TITLE_BUTTON_CY)).click();

    cy.get(buildDataCy(SAVE_TITLE_BUTTON_CY)).should('be.disabled');

    cy.get(buildDataCy(TITLE_INPUT_FIELD_CY)).type(
      '{backspace}{backspace}{backspace}',
    );

    cy.get(buildDataCy(SAVE_TITLE_BUTTON_CY)).should('not.be.disabled');
  });

  it('set text', () => {
    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY))
      .should('be.visible')
      .type(
        'Lorem ipsum dolor sit amet. Ut optio laborum qui ducimus rerum eum illum possimus non quidem facere.',
      );

    cy.get(buildDataCy(SAVE_TEXT_BUTTON_CY)).click();

    cy.get(buildDataCy(SAVE_TEXT_BUTTON_CY)).should('be.disabled');

    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY)).type(
      '{backspace}{backspace}{backspace}{backspace}{backspace}',
    );

    cy.get(buildDataCy(SAVE_TEXT_BUTTON_CY)).should('not.be.disabled');
  });

  it('set keywords', () => {
    cy.get(buildDataCy(ENTER_KEYWORD_FIELD_CY))
      .should('be.visible')
      .type('Lorem');

    cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should('not.exist');

    cy.get(buildDataCy(ENTER_KEYWORD_FIELD_CY)).type('{enter}');
    cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should('exist');

    cy.get(buildDataCy(SAVE_KEYWORDS_BUTTON_CY))
      .should('be.visible')
      .should('not.be.disabled')
      .click()
      .should('be.disabled');

    cy.get(buildDataCy(DELETE_KEYWORD_BUTTON_CY)).should('be.visible').click();
    cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should('not.exist');

    cy.get(buildDataCy(SAVE_KEYWORDS_BUTTON_CY)).should('not.be.disabled');
  });

  it.only('does not use chatbot (by default)', () => {
    cy.get(buildDataCy(USE_CHATBOT_DATA_CY)).should('not.be.checked');
  });
});

describe('Load Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: MOCK_APP_SETTINGS,
      },
      appContext: {
        context: Context.BUILDER,
        permission: PermissionLevel.Admin,
      },
    });
    cy.visit('/');
  });

  it('display existing mock text resource', () => {
    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY)).should(
      'contain',
      MOCK_APP_SETTINGS[0].data.text,
    );

    cy.get(buildDataCy(INITIAL_PROMPT_INPUT_FIELD_CY)).should(
      'contain',
      MOCK_APP_SETTINGS[2].data.text,
    );

    cy.get(buildDataCy(INITIAL_CHATBOT_PROMPT_INPUT_FIELD_CY)).should(
      'contain',
      MOCK_APP_SETTINGS[3].data.text,
    );

    const list = MOCK_APP_SETTINGS[1].data as KeywordsData;

    list.keywords.forEach((elem) => {
      cy.get(buildDataCy(KEYWORD_LIST_ITEM_CY)).should(
        'contain',
        `${elem.word} : ${elem.def}`,
      );
    });
  });
});
