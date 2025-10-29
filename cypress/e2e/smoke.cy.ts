/// <reference types="cypress" />

describe('Smoke Tests - API Health Check', () => {
  const apiUrl = Cypress.env('apiUrl');

  before(() => {
    cy.log('Verificando que la API esté disponible...');
  });

  it('should verify API is running', () => {
    cy.request(`${apiUrl}/health`)
      .its('status')
      .should('eq', 200);
  });

  it('should return OK status in health endpoint', () => {
    cy.request(`${apiUrl}/health`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status');
        expect(response.body.status).to.eq('OK');
      });
  });

  it('should have correct content-type header', () => {
    cy.request(`${apiUrl}/health`)
      .its('headers')
      .its('content-type')
      .should('include', 'application/json');
  });

  it('should respond in less than 200ms', () => {
    const start = Date.now();
    
    cy.request(`${apiUrl}/health`)
      .then(() => {
        const duration = Date.now() - start;
        expect(duration).to.be.lessThan(200);
      });
  });
});
