import { AppSetting, Context, PermissionLevel } from '@graasp/sdk';

import { CheckBoxState } from '@/components/common/table/types';

import { Keyword, KeywordsData } from '../../../src/config/appSettingTypes';
import {
  ADD_KEYWORD_BUTTON_CY,
  EDITABLE_TABLE_DELETE_SELECTION_BUTTON_CY,
  EDITABLE_TABLE_DISCARD_ALL_BUTTON_CY,
  EDITABLE_TABLE_FILTER_INPUT_CY,
  EDITABLE_TABLE_FILTER_NO_RESULT_CY,
  EDITABLE_TABLE_NO_DATA_CY,
  EDITABLE_TABLE_ROW_CY,
  EDITABLE_TABLE_SAVE_ALL_BUTTON_CY,
  ENTER_DEFINITION_FIELD_CY,
  ENTER_KEYWORD_FIELD_CY,
  SETTINGS_SAVE_BUTTON_CY,
  TEXT_INPUT_FIELD_CY,
  buildDataCy,
  buildEditableSelectAllButtonCy,
  buildEditableTableDeleteButtonCy,
  buildEditableTableDiscardButtonCy,
  buildEditableTableEditButtonCy,
  buildEditableTableSaveButtonCy,
  buildEditableTableSelectButtonCy,
  buildKeywordDefinitionTextInputCy,
  buildKeywordNotExistWarningCy,
  buildKeywordTextInputCy,
  buildTextFieldSelectorCy,
} from '../../../src/config/selectors';
import {
  MOCK_APP_SETTINGS_USING_CHATBOT,
  MOCK_KEYWORDS_SETTING,
  MOCK_KEYWORD_NOT_IN_TEXT,
} from '../../fixtures/appSettings';

const getKeywords = (appSettings: AppSetting[]): KeywordsData =>
  appSettings.find((appSetting) => appSetting === MOCK_KEYWORDS_SETTING)
    .data as KeywordsData;

/**
 * Checks that the given keywords are displayed correctly in the table.
 * @param keywords The keywords that should be displayed in the table.
 */
const checkAllKeywords = (keywords: Keyword[]): void =>
  keywords.forEach((elem) => {
    cy.get(buildDataCy(buildKeywordTextInputCy(elem.word, true))).should(
      'contain',
      elem.word,
    );
    cy.get(
      buildDataCy(buildKeywordDefinitionTextInputCy(elem.word, true)),
    ).should('contain', elem.def);
  });

describe('Empty Keywords', () => {
  const NEW_KEYWORD: Keyword = {
    word: 'lorem',
    def: 'Latin',
  };

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

  it('add keyword, then remove it', () => {
    cy.get(buildDataCy(ENTER_KEYWORD_FIELD_CY))
      .should('be.visible')
      .type(NEW_KEYWORD.word);

    cy.get(buildDataCy(ENTER_DEFINITION_FIELD_CY))
      .should('be.visible')
      .type(NEW_KEYWORD.def);

    cy.get(buildDataCy(EDITABLE_TABLE_NO_DATA_CY)).should('exist');

    cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY))
      .should('be.visible')
      .and('not.be.disabled');
    cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY)).click();
    cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY)).should('be.disabled');
    cy.get(buildDataCy(EDITABLE_TABLE_NO_DATA_CY)).should('not.exist');

    cy.get(buildDataCy(buildEditableTableDeleteButtonCy(NEW_KEYWORD.word)))
      .should('be.visible')
      .click();
    cy.get(buildDataCy(EDITABLE_TABLE_NO_DATA_CY)).should('exist');
  });

  // Detected incomplete keywords in the text.
  // 'wef' was found incomplete in 'wefwef hello'.
  // Check that only complete words are detected in text.
  it('only detect complete keywords', () => {
    const PRBLEMATIC_TEXT = 'wefwef hello';
    const PROBLEMATIC_KEYWORDS = ['wef', 'he'];

    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY))
      .should('be.visible')
      .type(PRBLEMATIC_TEXT);

    PROBLEMATIC_KEYWORDS.forEach((k) => {
      cy.get(buildDataCy(ENTER_KEYWORD_FIELD_CY)).should('be.visible').type(k);

      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY))
        .should('be.visible')
        .and('not.be.disabled');
      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY)).click();
      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY)).should('be.disabled');

      cy.get(buildDataCy(buildKeywordNotExistWarningCy(k))).should(
        'be.visible',
      );
    });

    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('be.disabled');
  });

  it('detect keywords case insensitive', () => {
    const TEXT = 'hello this is a Test';
    const KEYWORDS = ['Hello', 'test'];

    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY)).should('be.visible').type(TEXT);

    KEYWORDS.forEach((k) => {
      cy.get(buildDataCy(ENTER_KEYWORD_FIELD_CY)).should('be.visible').type(k);

      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY))
        .should('be.visible')
        .and('not.be.disabled');
      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY)).click();
      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY)).should('be.disabled');

      cy.get(buildDataCy(buildKeywordNotExistWarningCy(k))).should('not.exist');
    });

    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('be.disabled');
  });
});

describe('Existing Keywords', () => {
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

  describe('keywords are unique', () => {
    it('cannot add existing keyword', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const EXISTING_KEYWORD = KEYWORDS.at(0);

      const NEW_KEYWORD = {
        ...EXISTING_KEYWORD,
        def: `A totally new definition`,
      };

      cy.get(buildDataCy(ENTER_KEYWORD_FIELD_CY))
        .should('be.visible')
        .type(NEW_KEYWORD.word);

      cy.get(buildDataCy(ENTER_DEFINITION_FIELD_CY))
        .should('be.visible')
        .type(NEW_KEYWORD.def);

      cy.get(buildDataCy(EDITABLE_TABLE_NO_DATA_CY)).should('not.exist');
      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );

      // try to add the existing keyword
      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY))
        .should('be.visible')
        .and('not.be.disabled');
      cy.get(buildDataCy(ADD_KEYWORD_BUTTON_CY)).click();

      // check that the keyword is not added in the table
      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );
      // the add inputs should still contains the values
      cy.get(buildTextFieldSelectorCy(ENTER_KEYWORD_FIELD_CY)).should(
        'have.value',
        NEW_KEYWORD.word,
      );
      cy.get(buildTextFieldSelectorCy(ENTER_DEFINITION_FIELD_CY)).should(
        'have.value',
        NEW_KEYWORD.def,
      );

      // check that the current keyword was not updated
      cy.get(
        buildDataCy(
          buildKeywordDefinitionTextInputCy(EXISTING_KEYWORD.word, true),
        ),
      ).should('contain', EXISTING_KEYWORD.def);
    });

    it('cannot rename the keyword to an existing keyword', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const UPDATING_KEYWORD = KEYWORDS.at(0);
      const EXISTING_KEYWORD = KEYWORDS.at(1);

      checkAllKeywords(KEYWORDS);

      // edit the existing keyword to a keyword that are already in the table
      cy.get(
        buildDataCy(buildEditableTableEditButtonCy(UPDATING_KEYWORD.word)),
      ).click();
      cy.get(
        buildDataCy(buildKeywordTextInputCy(UPDATING_KEYWORD.word, false)),
      ).clear();
      cy.get(
        buildDataCy(buildKeywordTextInputCy(UPDATING_KEYWORD.word, false)),
      ).type(EXISTING_KEYWORD.word);

      // try to save the modifications, it should fail
      cy.get(
        buildDataCy(buildEditableTableSaveButtonCy(UPDATING_KEYWORD.word)),
      ).click();

      // the save button should still be visible
      cy.get(
        buildDataCy(buildEditableTableSaveButtonCy(UPDATING_KEYWORD.word)),
      ).should('be.visible');

      // discard the unsaved changes
      cy.get(
        buildDataCy(buildEditableTableDiscardButtonCy(UPDATING_KEYWORD.word)),
      ).click();

      // it should not have any modifications in the table
      checkAllKeywords(KEYWORDS);
    });
  });

  describe('edit and delete single keyword', () => {
    it('cannot save empty keyword', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const UPDATING_KEYWORD = KEYWORDS.at(0);

      checkAllKeywords(KEYWORDS);

      // edit the existing keyword to a keyword that are already in the table
      cy.get(
        buildDataCy(buildEditableTableEditButtonCy(UPDATING_KEYWORD.word)),
      ).click();
      cy.get(
        buildDataCy(buildKeywordTextInputCy(UPDATING_KEYWORD.word, false)),
      ).clear();

      // should not be able to save the modifications
      cy.get(
        buildDataCy(buildEditableTableSaveButtonCy(UPDATING_KEYWORD.word)),
      ).should('be.disabled');
    });

    it('edit a keyword', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const UPDATING_KEYWORD = KEYWORDS.at(0);
      const NEW_KEYWORD: Keyword = {
        word: 'new keyword',
        def: 'a new definition',
      };
      const NEW_KEYWORDS = [
        NEW_KEYWORD,
        ...KEYWORDS.filter(
          (k) => k.word.toLowerCase() !== UPDATING_KEYWORD.word.toLowerCase(),
        ),
      ];

      checkAllKeywords(KEYWORDS);

      // edit the existing keyword to a keyword that are already in the table
      cy.get(
        buildDataCy(buildEditableTableEditButtonCy(UPDATING_KEYWORD.word)),
      ).click();
      cy.get(
        buildDataCy(buildKeywordTextInputCy(UPDATING_KEYWORD.word, false)),
      ).clear();
      cy.get(
        buildDataCy(buildKeywordTextInputCy(UPDATING_KEYWORD.word, false)),
      ).type(NEW_KEYWORD.word);
      cy.get(
        buildDataCy(
          buildKeywordDefinitionTextInputCy(UPDATING_KEYWORD.word, false),
        ),
      ).clear();
      cy.get(
        buildDataCy(
          buildKeywordDefinitionTextInputCy(UPDATING_KEYWORD.word, false),
        ),
      ).type(NEW_KEYWORD.def);

      // save the modifications
      cy.get(
        buildDataCy(buildEditableTableSaveButtonCy(UPDATING_KEYWORD.word)),
      ).click();

      // the save button should not exist
      cy.get(
        buildDataCy(buildEditableTableSaveButtonCy(UPDATING_KEYWORD.word)),
      ).should('not.exist');

      // the modifications should have been apply and other keywords should still have same values
      checkAllKeywords(NEW_KEYWORDS);
    });

    it('delete a keyword', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const REMOVING_KEYWORD = KEYWORDS.at(0);
      const NEW_KEYWORDS = KEYWORDS.filter(
        (k) => k.word.toLowerCase() !== REMOVING_KEYWORD.word.toLowerCase(),
      );

      checkAllKeywords(KEYWORDS);
      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );

      cy.get(
        buildDataCy(buildEditableTableDeleteButtonCy(REMOVING_KEYWORD.word)),
      ).click();

      // check that the keyword is not in the table anymore
      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        NEW_KEYWORDS.length,
      );
      // check that the other keywords are still in the table
      checkAllKeywords(NEW_KEYWORDS);
    });
  });

  describe('filter keywords', () => {
    it('filter by keywords', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const FILTER_WORD = KEYWORDS.at(0).word;

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );

      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).clear();
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).type(
        FILTER_WORD,
      );

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should('have.length', 1);
      cy.get(buildDataCy(buildKeywordTextInputCy(FILTER_WORD, true)));

      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).clear();

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );
    });

    it('invalid filter display no result', () => {
      const FILTER_WORD = 'kd kjfd fkjbd';

      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).clear();
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).type(
        FILTER_WORD,
      );

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should('have.length', 0);
      cy.get(buildDataCy(EDITABLE_TABLE_FILTER_NO_RESULT_CY)).should('exist');
    });

    it('delete apply only on filtered selection', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const FILTER_WORD = KEYWORDS.at(0).word;
      const KEYWORDS_WITHOUT_FILTERED = KEYWORDS.filter(
        (k) => k.word.toLowerCase() !== FILTER_WORD.toLowerCase(),
      );

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );

      // select all the keywords
      cy.get(
        buildDataCy(buildEditableSelectAllButtonCy(CheckBoxState.UNCHECKED)),
      ).click();

      // filter by keyword
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).clear();
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).type(
        FILTER_WORD,
      );

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should('have.length', 1);
      cy.get(buildDataCy(buildKeywordTextInputCy(FILTER_WORD, true)));

      // the global checkbox should be checked
      cy.get(
        buildDataCy(buildEditableSelectAllButtonCy(CheckBoxState.CHECKED)),
      ).should('exist');

      // delete the filtered selection
      cy.get(buildDataCy(EDITABLE_TABLE_DELETE_SELECTION_BUTTON_CY)).click();

      // reset the filter
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).clear();

      // the other keywords should still be in the table and selected
      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS_WITHOUT_FILTERED.length,
      );
      checkAllKeywords(KEYWORDS_WITHOUT_FILTERED);

      // the filtered keyword should not exist
      cy.get(buildDataCy(buildKeywordTextInputCy(FILTER_WORD, true))).should(
        'not.exist',
      );

      // the global checkbox should be selected
      cy.get(
        buildDataCy(buildEditableSelectAllButtonCy(CheckBoxState.CHECKED)),
      ).should('exist');
    });

    it('editing keywords are conserved during filtering', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const FILTER_WORD = KEYWORDS.at(0).word;
      const UPDATING_KEYWORDS = [
        FILTER_WORD,
        KEYWORDS.at(KEYWORDS.length - 1).word,
      ];
      const NEW_KEYWORDS: Keyword[] = [
        {
          word: 'new keyword',
          def: 'a new definition',
        },
        {
          word: 'another keyword',
          def: 'another definition',
        },
      ];

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );

      // updates the keywords without saving for now
      UPDATING_KEYWORDS.forEach((k, idx) => {
        cy.get(buildDataCy(buildEditableTableEditButtonCy(k))).click();
        cy.get(buildDataCy(buildKeywordTextInputCy(k, false))).clear();
        cy.get(buildDataCy(buildKeywordTextInputCy(k, false))).type(
          NEW_KEYWORDS[idx].word,
        );
        cy.get(
          buildDataCy(buildKeywordDefinitionTextInputCy(k, false)),
        ).clear();
        cy.get(buildDataCy(buildKeywordDefinitionTextInputCy(k, false))).type(
          NEW_KEYWORDS[idx].def,
        );
      });

      // filter by keyword
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).clear();
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).type(
        FILTER_WORD,
      );

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should('have.length', 1);

      // check that the keyword is still in edition
      cy.get(
        buildTextFieldSelectorCy(buildKeywordTextInputCy(FILTER_WORD, false)),
      );

      // reset the filter
      cy.get(buildTextFieldSelectorCy(EDITABLE_TABLE_FILTER_INPUT_CY)).clear();

      // the keywords in edition must still be in this mode
      UPDATING_KEYWORDS.forEach((k, idx) => {
        cy.get(
          buildTextFieldSelectorCy(buildKeywordTextInputCy(k, false)),
        ).should('have.value', NEW_KEYWORDS[idx].word);
        cy.get(buildDataCy(buildKeywordDefinitionTextInputCy(k, false))).should(
          'contain',
          NEW_KEYWORDS[idx].def,
        );
      });
    });
  });

  describe('multiple keywords', () => {
    it('delete selection', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const SELECTED_KEYWORDS = [
        KEYWORDS.at(0).word,
        KEYWORDS.at(KEYWORDS.length - 1).word,
      ];

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );

      SELECTED_KEYWORDS.forEach((k) => {
        // Select the given keywords and check that it is possible to unselect it again
        cy.get(buildDataCy(buildEditableTableSelectButtonCy(k, false))).click();
        cy.get(buildDataCy(buildEditableTableSelectButtonCy(k, true))).click();
        cy.get(buildDataCy(buildEditableTableSelectButtonCy(k, false))).click();
      });

      // check the state of the global checkbox
      if (KEYWORDS.length > SELECTED_KEYWORDS.length) {
        cy.get(
          buildDataCy(
            buildEditableSelectAllButtonCy(CheckBoxState.INDETERMINATE),
          ),
        );
      } else {
        cy.get(
          buildDataCy(buildEditableSelectAllButtonCy(CheckBoxState.CHECKED)),
        );
      }

      // delete the selection
      cy.get(buildDataCy(EDITABLE_TABLE_DELETE_SELECTION_BUTTON_CY)).click();

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length - SELECTED_KEYWORDS.length,
      );
      if (KEYWORDS.length - SELECTED_KEYWORDS.length === 0) {
        cy.get(buildDataCy(EDITABLE_TABLE_NO_DATA_CY)).should('be.visible');
      }
    });

    it('delete all', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should(
        'have.length',
        KEYWORDS.length,
      );

      KEYWORDS.forEach((k) =>
        cy
          .get(buildDataCy(buildEditableTableSelectButtonCy(k.word, false)))
          .click(),
      );

      // check the state of the global checkbox
      cy.get(
        buildDataCy(buildEditableSelectAllButtonCy(CheckBoxState.CHECKED)),
      );

      // delete the selection
      cy.get(buildDataCy(EDITABLE_TABLE_DELETE_SELECTION_BUTTON_CY)).click();

      cy.get(buildDataCy(EDITABLE_TABLE_ROW_CY)).should('have.length', 0);
      cy.get(buildDataCy(EDITABLE_TABLE_NO_DATA_CY)).should('be.visible');
    });

    it('edit multiple keywords', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const UPDATING_KEYWORDS = [
        KEYWORDS.at(0).word,
        KEYWORDS.at(KEYWORDS.length - 1).word,
      ];
      const NEW_KEYWORDS: Keyword[] = [
        {
          word: 'new keyword',
          def: 'a new definition',
        },
        {
          word: 'another keyword',
          def: 'another definition',
        },
      ];
      const RESULTS_KEYWORDS = [
        ...NEW_KEYWORDS,
        ...KEYWORDS.filter(
          (k) =>
            !UPDATING_KEYWORDS.find(
              (k1) => k.word.toLowerCase() === k1.toLowerCase(),
            ),
        ),
      ];

      checkAllKeywords(KEYWORDS);

      // updates the keywords without saving for now
      UPDATING_KEYWORDS.forEach((k, idx) => {
        cy.get(buildDataCy(buildEditableTableEditButtonCy(k))).click();
        cy.get(buildDataCy(buildKeywordTextInputCy(k, false))).clear();
        cy.get(buildDataCy(buildKeywordTextInputCy(k, false))).type(
          NEW_KEYWORDS[idx].word,
        );
        cy.get(
          buildDataCy(buildKeywordDefinitionTextInputCy(k, false)),
        ).clear();
        cy.get(buildDataCy(buildKeywordDefinitionTextInputCy(k, false))).type(
          NEW_KEYWORDS[idx].def,
        );
      });

      // save all the modifications
      cy.get(buildDataCy(EDITABLE_TABLE_SAVE_ALL_BUTTON_CY)).click();

      // the save button should not exist
      cy.get(buildDataCy(EDITABLE_TABLE_SAVE_ALL_BUTTON_CY)).should(
        'not.exist',
      );

      // the modifications should have been apply and other keywords should still have same values
      checkAllKeywords(RESULTS_KEYWORDS);
    });

    it('discard multiple keywords', () => {
      const KEYWORDS = getKeywords(MOCK_APP_SETTINGS_USING_CHATBOT).keywords;
      const UPDATING_KEYWORDS = [
        KEYWORDS.at(0).word,
        KEYWORDS.at(KEYWORDS.length - 1).word,
      ];
      const NEW_KEYWORDS: Keyword[] = [
        {
          word: 'new keyword',
          def: 'a new definition',
        },
        {
          word: 'another keyword',
          def: 'another definition',
        },
      ];

      checkAllKeywords(KEYWORDS);

      UPDATING_KEYWORDS.forEach((k, idx) => {
        // edit the existing keyword to a keyword that are already in the table
        cy.get(buildDataCy(buildEditableTableEditButtonCy(k))).click();
        cy.get(buildDataCy(buildKeywordTextInputCy(k, false))).clear();
        cy.get(buildDataCy(buildKeywordTextInputCy(k, false))).type(
          NEW_KEYWORDS[idx].word,
        );
        cy.get(
          buildDataCy(buildKeywordDefinitionTextInputCy(k, false)),
        ).clear();
        cy.get(buildDataCy(buildKeywordDefinitionTextInputCy(k, false))).type(
          NEW_KEYWORDS[idx].def,
        );
      });

      // discard all the modifications
      cy.get(buildDataCy(EDITABLE_TABLE_DISCARD_ALL_BUTTON_CY)).click();

      // the discard button should not exist
      cy.get(buildDataCy(EDITABLE_TABLE_DISCARD_ALL_BUTTON_CY)).should(
        'not.exist',
      );

      // all keywords should still have same values
      checkAllKeywords(KEYWORDS);
    });
  });

  it('keyword not in text display warning', () => {
    const KEYWORD_IN_TEXT = getKeywords(
      MOCK_APP_SETTINGS_USING_CHATBOT,
    ).keywords.at(0).word;

    // add keyword to text to be sure that it appear in it
    cy.get(buildDataCy(TEXT_INPUT_FIELD_CY)).type(` ${KEYWORD_IN_TEXT}`);
    // should be disabled automatically by auto save
    cy.get(buildDataCy(SETTINGS_SAVE_BUTTON_CY)).should('be.disabled');

    // the existing keyword should not have warning
    cy.get(buildDataCy(buildKeywordNotExistWarningCy(KEYWORD_IN_TEXT))).should(
      'not.exist',
    );

    // the missing keyword should have a warning
    cy.get(
      buildDataCy(buildKeywordNotExistWarningCy(MOCK_KEYWORD_NOT_IN_TEXT.word)),
    ).should('be.visible');
  });
});
