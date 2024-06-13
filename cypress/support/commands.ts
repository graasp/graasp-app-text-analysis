/// <reference types="../../src/interfaces/window" />
import { PermissionLevel } from '@graasp/sdk';

import '@testing-library/cypress/add-commands';

import { MOCK_SERVER_API_HOST } from '../fixtures/appData';
import { MOCK_SERVER_ITEM } from '../fixtures/item';
import { CURRENT_MEMBER, MEMBERS } from '../fixtures/members';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add(
  'setUpApi',
  ({ currentMember = CURRENT_MEMBER, database = {}, appContext } = {}) => {
    // mock api and database
    Cypress.on('window:before:load', (win) => {
      // eslint-disable-next-line no-param-reassign
      win.database = {
        appData: [],
        appSettings: [],
        appActions: [],
        items: [MOCK_SERVER_ITEM],
        members: Object.values(MEMBERS),
        ...database,
      };
      // eslint-disable-next-line no-param-reassign
      win.appContext = {
        memberId: currentMember.id,
        itemId: MOCK_SERVER_ITEM.id,
        apiHost: Cypress.env('VITE_API_HOST') || MOCK_SERVER_API_HOST,
        context: 'standalone',
        permission: PermissionLevel.Read,
        ...appContext,
      };
    });
  },
);
