describe('ForgeDesk user journeys', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('logs in via the form and reaches the dashboard', () => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type('ada@example.com');
    cy.get('[data-cy="password"]').type('secret');
    cy.get('[data-cy="submit"]').click();
    cy.location('pathname').should('eq', '/dashboard');
    cy.get('[data-cy="welcome"]').should('contain', 'ada@example.com');
  });

  it('shows an alert on invalid credentials', () => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type('ada@example.com');
    cy.get('[data-cy="password"]').type('wrong');
    cy.get('[data-cy="submit"]').click();
    cy.get('[role="alert"]').should('contain', 'Invalid credentials');
    cy.location('pathname').should('eq', '/login');
  });

  it('redirects unauthenticated users from /admin to login with next param', () => {
    cy.visit('/admin');
    cy.location('pathname').should('eq', '/login');
    cy.location('search').should('include', 'next=%2Fadmin');

    cy.get('[data-cy="email"]').type('ada@example.com');
    cy.get('[data-cy="password"]').type('secret');
    cy.get('[data-cy="submit"]').click();
    cy.location('pathname').should('eq', '/admin');
    cy.contains('h1', 'Admin Panel');
  });
});
