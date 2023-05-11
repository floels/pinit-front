import en from "../../../messages/en.json";
import { URL_PATTERN_UNAUTHENTICATED_HOMEPAGE_PICTURE_SLIDER_IMAGES } from "../utils/constants";

const DEFAULT_VIEWPORT_HEIGHT_PX = 660; // see https://docs.cypress.io/api/commands/viewport#Default-sizing

const messages = en.HomePageUnauthenticated;

describe("Home page", () => {
  it("should display the unauthenticated homepage as expected", () => {
    // Mock picture slider images (hosted in S3 bucket) for better performance:
    cy.intercept(URL_PATTERN_UNAUTHENTICATED_HOMEPAGE_PICTURE_SLIDER_IMAGES, {
      fixture: "dummy_image_landing_page_pictures_slider.jpeg",
    });

    cy.visit("/");

    cy.contains(messages.GET_YOUR_NEXT).should("be.visible");
    cy.contains(messages.HEADER_FOOD).should("be.visible");

    // Open and close login form
    cy.contains(messages.LOG_IN).click();
    cy.contains(messages.WELCOME_TO_PINIT).should("be.visible");
    cy.get("[data-testid=overlay-modal-close-button]").click();
    cy.contains(messages.WELCOME_TO_PINIT).should("not.exist");

    // Open login form, switch to signup form and then back to login form
    cy.contains(messages.LOG_IN).click();
    cy.contains(messages.NO_ACCOUNT_YET).within(() => {
      cy.contains(messages.SIGN_UP).click();
    });
    cy.contains(messages.FIND_NEW_IDEAS).should("be.visible");

    cy.contains(messages.ALREADY_HAVE_ACCOUNT).within(() => {
      cy.contains(messages.LOG_IN).click();
    });
    cy.contains(messages.NO_ACCOUNT_YET).should("be.visible");
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
    cy.contains(messages.HOW_IT_WORKS).click();
    cy.get("[data-testid=homepage-unauthenticated-content]").should(
      "have.css",
      "transform",
      `matrix(1, 0, 0, 1, 0, -${DEFAULT_VIEWPORT_HEIGHT_PX})`
    );
  });
});
