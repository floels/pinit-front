import en from "../../../lang/en.json";

describe("Home page", () => {
  it("should display the unauthenticated homepage as expected", () => {
    cy.visit("/");

    cy.contains(en.GET_YOUR_NEXT).should("be.visible");
    cy.contains(en.HEADER_FOOD).should("be.visible");

    // Open and close login form
    cy.contains(en.LOG_IN).click();
    cy.contains(en.WELCOME_TO_PINIT).should("be.visible");
    cy.get("[data-testid=overlay-modal-close-button").click();
    cy.contains(en.WELCOME_TO_PINIT).should("not.exist");

    // Open login form, switch to signup form and then back to login form
    cy.contains(en.LOG_IN).click();
    cy.contains(en.NO_ACCOUNT_YET).within((div) => {
      cy.contains(en.SIGN_UP).click();
    });
    cy.contains(en.FIND_NEW_IDEAS).should("be.visible");

    cy.contains(en.ALREADY_HAVE_ACCOUNT).within((div) => {
      cy.contains(en.LOG_IN).click();
    });
    cy.contains(en.NO_ACCOUNT_YET).should("be.visible");
    cy.get("[data-testid=overlay-modal-close-button").click();

    // Examine content of the page
    cy.contains(en.SEARCH_FOR_AN_IDEA).should("not.be.visible");

    cy.get("[data-testid=picture-slider-carret").click();

    cy.contains(en.SEARCH_FOR_AN_IDEA).should("be.visible");
  });
});
