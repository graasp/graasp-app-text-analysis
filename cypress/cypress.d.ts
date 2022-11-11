/// <reference types="cypress" />
import { Database, LocalContext, Member } from '@graasp/apps-query-client';

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
