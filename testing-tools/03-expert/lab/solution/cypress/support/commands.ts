/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      loginAs(role: 'admin' | 'member'): Chainable<void>;
    }
  }
}

const users = {
  admin: { email: 'admin@forge.test', password: 'admin-secret' },
  member: { email: 'member@forge.test', password: 'member-secret' },
};

Cypress.Commands.add('loginAs', (role: 'admin' | 'member') => {
  const user = users[role];

  cy.intercept('POST', '/api/login', {
    statusCode: 200,
    body: { email: user.email, role, token: `token-${role}` },
  }).as('login');

  cy.visit('/login');
  cy.get('[data-cy="email"]').clear().type(user.email);
  cy.get('[data-cy="password"]').clear().type(user.password);
  cy.get('[data-cy="submit"]').click();
  cy.wait('@login');
});

export {};
