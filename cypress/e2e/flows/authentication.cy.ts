import { EMAIL_ADDRESS, PASSWORD } from "../../fixtures/authentication";
import en from "../../../messages/en.json";

describe("Authentication", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("should be able to log in and then log out", () => {
    cy.visit("/");

    cy.contains(en.HomePageUnauthenticated.LOG_IN).click();

    cy.get("input[name='email']").type(EMAIL_ADDRESS);
    cy.get("input[name='password']").type(PASSWORD);

    cy.intercept(
      {
        method: "POST",
        url: "/api/token",
      },
      {
        statusCode: 200,
        body: {
          access: "access_token",
          refresh: "refresh_token",
        },
      }
    );

    cy.contains(en.HomePageUnauthenticated.LOG_IN).click();

    cy.contains(en.HomePageAuthenticated.NAV_ITEM_HOME);

    // Check presence of authentication cookies:
    cy.getCookie("accessToken").should("exist");
    cy.getCookie("refreshToken").should("exist");

    cy.get("[data-icon='angle-down']").eq(1).click(); // open account options flyout
    cy.contains(en.HomePageAuthenticated.LOG_OUT).click();

    cy.contains(en.HomePageUnauthenticated.LOG_IN);
    cy.getCookie("accessToken").should("not.exist");
    cy.getCookie("refreshToken").should("not.exist");
  });
});
