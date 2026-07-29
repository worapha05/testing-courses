describe('Network stubbing and roles', () => {
  it('stubs profile API for admin', () => {
    cy.fixture('profiles').then((profiles) => {
      cy.intercept('GET', '/api/me', {
        statusCode: 200,
        body: profiles.adminProfile,
      }).as('me');

      cy.loginAs('admin');
      cy.visit('/profile');
      cy.wait('@me');
      cy.contains(profiles.adminProfile.email);
      cy.contains(/billing/i);
    });
  });

  it('returns 403 for member visiting billing', () => {
    cy.intercept('GET', '/api/billing', {
      statusCode: 403,
      body: { message: 'Forbidden' },
    }).as('billing');

    cy.loginAs('member');
    cy.visit('/billing');
    cy.wait('@billing');
    cy.get('[role="alert"]').should('contain', 'Forbidden');
  });

  it('simulates two roles sequentially via cy.session', () => {
    cy.intercept('GET', '/api/me', {
      statusCode: 200,
      body: { email: 'admin@corp.test', role: 'admin', permissions: ['read', 'write'] },
    }).as('meAdmin');

    cy.session('admin-session', () => {
      cy.loginAs('admin');
    });
    cy.visit('/profile');
    cy.wait('@meAdmin');
    cy.contains('admin@corp.test');

    cy.intercept('GET', '/api/me', {
      statusCode: 200,
      body: { email: 'member@corp.test', role: 'member', permissions: ['read'] },
    }).as('meMember');

    cy.session('member-session', () => {
      cy.loginAs('member');
    });
    cy.visit('/profile');
    cy.wait('@meMember');
    cy.contains('member@corp.test');
  });
});
