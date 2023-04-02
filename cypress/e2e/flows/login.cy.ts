import en from "../../../lang/en.json";

describe("Login", () => {
  it("should be able to log in", () => {
    cy.visit("/");
    cy.contains(en.LOG_IN).click();
  });
});
