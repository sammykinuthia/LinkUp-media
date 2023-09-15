describe('Register user', () => {
  beforeEach(() => {
    cy.visit('/auth/register')
  })

  it("fail to register user", () => {
    cy.get('#email').type("admin@mail.com")
    cy.get('#password').type("admin")
    cy.get('button').click()
    setTimeout(() => {
      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/")
      })
    }, 1000)
  })

  it('Registers successifully', () => {

    cy.get('#email').type("admin@gmail.com")
    cy.get('#password').type("admin")
    cy.get('#username').type("admin")
    cy.get('button').click()

    cy.location().should(loc => {
      expect(loc.pathname).to.eq("/")
    })

  })
})