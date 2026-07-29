describe('ForgeGate advanced patterns', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it('loads billing for admin via loginAs + intercept', () => {
    cy.intercept('GET', '/api/billing', {
      statusCode: 200,
      body: { message: 'Admin billing' },
    }).as('billing');

    cy.loginAs('admin');
    cy.visit('/billing');
    cy.wait('@billing');
    cy.get('[data-cy="billing-status"]').should('contain', 'Admin billing');
  });

  it('shows alert when billing API returns 500', () => {
    cy.intercept('GET', '/api/billing', {
      statusCode: 500,
      body: { message: 'Upstream down' },
    }).as('billingFail');

    cy.loginAs('admin');
    cy.visit('/billing');
    cy.wait('@billingFail');
    cy.get('[role="alert"]').should('contain', 'Upstream down');
  });

  it('shows 403 for member role', () => {
    cy.intercept('GET', '/api/billing', {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }).as('billingForbidden');

    cy.loginAs('member');
    cy.visit('/billing');
    cy.wait('@billingForbidden');
    cy.get('[role="alert"]').should('contain', 'Forbidden');
  });
});
