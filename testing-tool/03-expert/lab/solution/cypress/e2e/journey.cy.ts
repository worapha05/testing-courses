describe('ForgeGate journeys', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('logs in and reaches the dashboard', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { email: 'admin@forge.test', role: 'admin', token: 't' },
    }).as('login');

    cy.visit('/login');
    cy.get('[data-cy="email"]').type('admin@forge.test');
    cy.get('[data-cy="password"]').type('admin-secret');
    cy.get('[data-cy="submit"]').click();
    cy.wait('@login');
    cy.location('pathname').should('eq', '/dashboard');
    cy.get('[data-cy="welcome"]').should('contain', 'admin@forge.test');
  });

  it('shows alert on invalid credentials', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('loginFail');

    cy.visit('/login');
    cy.get('[data-cy="email"]').type('admin@forge.test');
    cy.get('[data-cy="password"]').type('wrong');
    cy.get('[data-cy="submit"]').click();
    cy.wait('@loginFail');
    cy.get('[role="alert"]').should('contain', 'Invalid credentials');
  });

  it('redirects guarded routes and returns via next param', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { email: 'admin@forge.test', role: 'admin', token: 't' },
    }).as('login');
    cy.intercept('GET', '/api/billing', {
      statusCode: 200,
      body: { message: 'Invoice ready' },
    }).as('billing');

    cy.visit('/billing');
    cy.location('pathname').should('eq', '/login');
    cy.location('search').should('include', 'next=%2Fbilling');

    cy.get('[data-cy="email"]').type('admin@forge.test');
    cy.get('[data-cy="password"]').type('admin-secret');
    cy.get('[data-cy="submit"]').click();
    cy.wait('@login');
    cy.location('pathname').should('eq', '/billing');
    cy.wait('@billing');
    cy.get('[data-cy="billing-status"]').should('contain', 'Invoice ready');
  });
});
