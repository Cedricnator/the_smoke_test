/// <reference types="cypress" />

// ***********************************************
// Custom commands for API testing
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to make API requests
       * @example cy.apiRequest('GET', '/health')
       */
      apiRequest(method: string, url: string, body?: any): Chainable<Cypress.Response<any>>;
    }
  }
}

Cypress.Commands.add('apiRequest', (method: string, url: string, body?: any) => {
  return cy.request({
    method,
    url: `${Cypress.env('apiUrl')}${url}`,
    body,
    failOnStatusCode: false,
  });
});

export {};
