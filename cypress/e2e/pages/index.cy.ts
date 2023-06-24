import en from "../../../messages/en.json";

const DEFAULT_VIEWPORT_HEIGHT_PX = 660; // see https://docs.cypress.io/api/commands/viewport#Default-sizing

const labels = en.HomePageUnauthenticated;

describe("Home page", () => {
  it("should display the unauthenticated homepage as expected", () => {
    cy.visit("/");
    cy.wait(5000); // needed to guarantee page has become interactive

    cy.contains(labels.PictureSlider.GET_YOUR_NEXT).should("be.visible");
    cy.contains(labels.PictureSlider.HEADER_FOOD).should("be.visible");

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
