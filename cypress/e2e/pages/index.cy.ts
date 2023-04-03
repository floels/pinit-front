import en from "../../../lang/en.json";

const DEFAULT_VIEWPORT_HEIGHT_PX = 660; // see https://docs.cypress.io/api/commands/viewport#Default-sizing

describe("Home page", () => {
  it("should display the unauthenticated homepage as expected", () => {
    cy.visit("/");

    cy.contains(en.GET_YOUR_NEXT).should("be.visible");
    cy.contains(en.HEADER_FOOD).should("be.visible");

    // Open and close login form
    cy.contains(en.LOG_IN).click();
    cy.contains(en.WELCOME_TO_PINIT).should("be.visible");
    cy.get("[data-testid=overlay-modal-close-button]").click();
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
    cy.get("[data-testid=overlay-modal-close-button]").click();

    // Test transitions between first and second fold
    cy.contains(en.SEARCH_FOR_AN_IDEA).should("not.be.visible");

    cy.document().trigger("wheel", { deltaY: 1 });
    cy.get("[data-testid=homepage-unauthenticated-content]").should(
      "have.css",
      "transform",
      `matrix(1, 0, 0, 1, 0, -${DEFAULT_VIEWPORT_HEIGHT_PX})`
    );
    cy.contains(en.SEARCH_FOR_AN_IDEA).should("be.visible");

    cy.document().trigger("wheel", { deltaY: -1 });
    cy.get("[data-testid=homepage-unauthenticated-content]").should(
      "have.css",
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)"
    );

    cy.get("[data-testid=picture-slider-carret").click();
    cy.get("[data-testid=homepage-unauthenticated-content]").should(
      "have.css",
      "transform",
      `matrix(1, 0, 0, 1, 0, -${DEFAULT_VIEWPORT_HEIGHT_PX})`
    );

    cy.document().trigger("wheel", { deltaY: -1 });
    cy.contains(en.HOW_IT_WORKS).click();
    cy.get("[data-testid=homepage-unauthenticated-content]").should(
      "have.css",
      "transform",
      `matrix(1, 0, 0, 1, 0, -${DEFAULT_VIEWPORT_HEIGHT_PX})`
    );
  });
});
