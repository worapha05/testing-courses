/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'admin' | 'member'): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAs', (role: 'admin' | 'member') => {
  const users = {
    admin: { email: 'admin@corp.test', password: 'admin-secret' },
    member: { email: 'member@corp.test', password: 'member-secret' },
  };
  const user = users[role];

  cy.intercept('POST', '/api/login', {
    statusCode: 200,
    body: { token: `token-${role}`, role, email: user.email },
  }).as('login');

  cy.visit('/login');
  cy.get('[data-cy="email"]').clear().type(user.email);
  cy.get('[data-cy="password"]').clear().type(user.password);
  cy.get('[data-cy="submit"]').click();
  cy.wait('@login');
});

export {};
