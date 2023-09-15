describe('Logins user', () => {
  beforeEach(() => {
    cy.visit('/auth/login')
  })
  it("fail to login user", () => {
    cy.get('#email').type("admin@mail.com")
    cy.get('#password').type("admin")
    cy.get('button').click()
    setTimeout(() => {
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/")
      })
    }, 1000)
  })

  it('logs in successifully', () => {

    cy.get('#email').type("admin@gmail.com")
    cy.get('#password').type("admin")
    cy.get('button').click()
    let errorMessage = cy.get("#form-message")

    cy.location().should(loc => {
      loc.pathname.should('be.eq')
    })
    errorMessage.should('be.visible')

  })
})