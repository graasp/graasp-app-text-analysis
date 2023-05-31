/// <reference types="cypress" />
import { Database, LocalContext } from '@graasp/apps-query-client';
import { Member } from '@graasp/sdk';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to set up the API elements
       * @example cy.setUpApi(datataBase: Database, currentMember: Member, appContext: LocalContext)
       */
      setUpApi({
        database,
        currentMember,
        appContext,
      }: {
        database?: Partial<Database>;
        currentMember?: Member;
        appContext?: Partial<LocalContext>;
      }): Chainable<Element>;
    }
  }
}

export {};
