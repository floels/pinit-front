import en from "../../../messages/en.json";

const DEFAULT_VIEWPORT_HEIGHT_PX = 660; // see https://docs.cypress.io/api/commands/viewport#Default-sizing

const labels = en.HomePageUnauthenticated;

describe("Home page", () => {
  it("should display the unauthenticated homepage as expected", () => {
    cy.visit("/");
    cy.wait(1000); // needed to guarantee page has become interactive

    cy.contains(labels.PictureSlider.GET_YOUR_NEXT).should("be.visible");
    cy.contains(labels.PictureSlider.HEADER_FOOD).should("be.visible");

    // Open and close login form
    cy.contains(labels.Header.LOG_IN).click();
    cy.contains(labels.Header.LoginForm.WELCOME_TO_PINIT).should("be.visible");
    cy.get("[data-testid=overlay-modal-close-button]").click();
    cy.contains(labels.Header.LoginForm.WELCOME_TO_PINIT).should("not.exist");

    // Open login form, switch to signup form and then back to login form
    cy.contains(labels.Header.LOG_IN).click();
    cy.contains(labels.Header.LoginForm.NO_ACCOUNT_YET).within(() => {
      cy.contains(labels.Header.LoginForm.SIGN_UP).click();
    });
    cy.contains(labels.Header.SignupForm.FIND_NEW_IDEAS).should("be.visible");

    cy.contains(labels.Header.SignupForm.ALREADY_HAVE_ACCOUNT).within(() => {
      cy.contains(labels.Header.SignupForm.LOG_IN).click();
    });
    cy.contains(labels.Header.LoginForm.NO_ACCOUNT_YET).should("be.visible");
    cy.get("[data-testid=overlay-modal-close-button]").click();

    // Test transitions between first and second fold
    cy.document().trigger("wheel", { deltaY: 1 });
    cy.get("[data-testid=homepage-unauthenticated-content]").should(
      "have.css",
      "transform",
      `matrix(1, 0, 0, 1, 0, -${DEFAULT_VIEWPORT_HEIGHT_PX})`
    );

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
    cy.contains(labels.PictureSlider.HOW_IT_WORKS).click();
    cy.get("[data-testid=homepage-unauthenticated-content]").should(
      "have.css",
      "transform",
      `matrix(1, 0, 0, 1, 0, -${DEFAULT_VIEWPORT_HEIGHT_PX})`
    );
  });
});
