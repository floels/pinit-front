import en from "../../../lang/en.json";

describe("Home page", () => {
  it("should display the unauthenticated homepage as expected", () => {
    cy.visit("/");

    cy.contains(en.GET_YOUR_NEXT).should("be.visible");
    cy.contains(en.HEADER_FOOD).should("be.visible");

    // TODO: check that you can open and close login form and signup form
    // and that you can switch between the two

    cy.contains(en.SEARCH_FOR_AN_IDEA).should("not.be.visible");

    cy.get("[data-testid=picture-slider-carret").click();

    cy.contains(en.SEARCH_FOR_AN_IDEA).should("be.visible");
  });
});
