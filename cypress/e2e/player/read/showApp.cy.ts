import { Context, PermissionLevel } from '@graasp/sdk';

import { DEFAULT_TEXT_RESOURCE_SETTING } from '../../../../src/config/appSettings';
import {
  BANNER_CY,
  PLAYER_VIEW_CY,
  SUMMON_BUTTON_CY,
  TEXT_DISPLAY_FIELD_CY,
  buildAllKeywordsButtonDataCy,
  buildDataCy,
} from '../../../../src/config/selectors';
import {
  MOCK_APP_SETTINGS,
  MOCK_TEXT_RESOURCE,
} from '../../../fixtures/appSettings';

describe('Empty App Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: [],
      },
      appContext: {
        context: Context.PLAYER,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('show app with no data', () => {
    // check that the player view is shown
    cy.get(buildDataCy(PLAYER_VIEW_CY)).should('be.visible');

    // check that the text field is displayed and empty
    cy.get(buildDataCy(TEXT_DISPLAY_FIELD_CY))
      .should('be.visible')
      .and('have.value', DEFAULT_TEXT_RESOURCE_SETTING.text);

    // check that the summon button is visible but disable
    cy.get(buildDataCy(SUMMON_BUTTON_CY))
      .should('be.visible')
      .and('be.disabled');

    // check that the top grey banner is visible
    cy.get(buildDataCy(BANNER_CY)).should('be.visible');
  });
});

describe('With App Setting', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: MOCK_APP_SETTINGS,
      },
      appContext: {
        context: Context.PLAYER,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('show app with data', () => {
    // check that the player view is shown
    cy.get(buildDataCy(PLAYER_VIEW_CY)).should('be.visible');

    // check that the text diplayed is the one corresponding to the mock text resoure
    cy.get(buildDataCy(TEXT_DISPLAY_FIELD_CY))
      .should('be.visible')
      .and('contain', MOCK_TEXT_RESOURCE);

    // check that the summon button is visible and active
    cy.get(buildDataCy(SUMMON_BUTTON_CY))
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('highlight keywords when summon', () => {
    // check that the summon button click works
    cy.get(buildDataCy(SUMMON_BUTTON_CY)).click();

    // check that after summon, keywords are highlighted
    cy.get(buildAllKeywordsButtonDataCy()).each((elem) =>
      cy.wrap(elem).should('be.visible'),
    );
  });
});
