import { Context, PermissionLevel } from '@graasp/sdk';

import {
  BUILDER_VIEW_CY,
  DELETE_KEYWORD_BUTTON_CY,
  ENTER_KEYWORD_FIELD_CY,
  KEYWORD_LIST_ITEM_CY,
  SAVE_KEYWORDS_BUTTON_CY,
  SAVE_TEXT_BUTTON_CY,
  SAVE_TITLE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  TITLE_INPUT_FIELD_CY,
  buildDataCy,
} from '../../../src/config/selectors';

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
});
