import { Context, PermissionLevel } from '@graasp/sdk';

import { DEFAULT_TEXT_RESOURCE_SETTING } from '../../../../src/config/appSettings';
import {
  BANNER_CY,
  CHATBOT_MODE_CY,
  DICTIONNARY_MODE_CY,
  PLAYER_VIEW_CY,
  SHOW_KEYWORDS_BUTTON_CY,
  TEXT_DISPLAY_FIELD_CY,
  buildAllKeywordsButtonDataCy,
  buildDataCy,
  keywordDataCy,
} from '../../../../src/config/selectors';
import {
  MOCK_APP_SETTINGS,
  MOCK_TEXT_RESOURCE,
  buildMock,
} from '../../../fixtures/appSettings';

describe('Empty App Settings', () => {
  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: [],
      },
      appContext: {
        context: Context.Player,
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

    // check that the show keywords button is visible but disable
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY))
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
        context: Context.Player,
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

    // check that the show keywords button is visible and active
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY))
      .should('be.visible')
      .and('not.be.disabled');
  });

  it('highlight keywords when summon', () => {
    // check that the show keywords button click works
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY)).click();

    // check that after summon, keywords are highlighted
    cy.get(buildAllKeywordsButtonDataCy()).each((elem) =>
      cy.wrap(elem).should('be.visible'),
    );
  });
});

describe('Check incomplete keywords and case insensitive', () => {
  const TEXT = 'wefwef hello Test';
  const KEYWORD_INSENSITIVE = { word: 'test', def: '' };
  const INCOMPLETE_KEYWORDS = [
    { word: 'wef', def: '' },
    { word: 'he', def: '' },
  ];
  const KEYWORDS = [KEYWORD_INSENSITIVE, ...INCOMPLETE_KEYWORDS];

  beforeEach(() => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: buildMock(TEXT, KEYWORDS),
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');
  });

  it('show keywords case insensitive', () => {
    // check that the show keywords button is visible and active
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY))
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.get(buildDataCy(keywordDataCy(KEYWORD_INSENSITIVE.word))).should(
      'be.visible',
    );
  });

  it('incomplete words should not match as prefix in the text', () => {
    // check that the show keywords button is visible and active
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY))
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    INCOMPLETE_KEYWORDS.forEach((k) => {
      cy.get(buildDataCy(keywordDataCy(k.word))).should('not.exist');
    });
  });
});

describe('Keywords should keep same case as in the text', () => {
  const WORD_CAPITALIZE = 'Test';
  const WORD_LOWER = 'docker';
  const TEXT = `${WORD_CAPITALIZE} ${WORD_LOWER}`;
  const KEYWORDS = [
    { word: WORD_CAPITALIZE.toLowerCase(), def: '' },
    { word: WORD_LOWER, def: '' },
  ];

  const capitalize = (word: string): string =>
    word.slice(0, 1).toUpperCase() + word.slice(1);

  const validateKeywordCase = (
    dataCy: string,
    textWord: string,
    isLowerCase: boolean,
  ): void => {
    // Because we use the word displayed in the text, it should be lowercase for keywordDataCy.
    cy.get(buildDataCy(keywordDataCy(textWord.toLowerCase()))).click();
    cy.get(buildDataCy(dataCy)).should(
      'contain',
      isLowerCase ? textWord.toLowerCase() : textWord,
    );
    // This one is just to check that contain is case sensitive.
    cy.get(buildDataCy(dataCy)).should(
      'not.contain',
      isLowerCase ? capitalize(textWord) : textWord.toLowerCase(),
    );
  };

  it('display keyword case as in text in keyword mode', () => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: buildMock(TEXT, KEYWORDS),
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');

    // check that the show keywords button is visible and active
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY))
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    validateKeywordCase(DICTIONNARY_MODE_CY, WORD_CAPITALIZE, false);
    validateKeywordCase(DICTIONNARY_MODE_CY, WORD_LOWER, true);
  });

  it('display keyword case as in text in chatbot mode', () => {
    cy.setUpApi({
      database: {
        appData: [],
        appSettings: buildMock(TEXT, KEYWORDS, true),
      },
      appContext: {
        context: Context.Player,
        permission: PermissionLevel.Read,
      },
    });
    cy.visit('/');

    // check that the show keywords button is visible and active
    cy.get(buildDataCy(SHOW_KEYWORDS_BUTTON_CY))
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    validateKeywordCase(CHATBOT_MODE_CY, WORD_CAPITALIZE, false);
    validateKeywordCase(CHATBOT_MODE_CY, WORD_LOWER, true);
  });
});
