import { EMAIL_ADDRESS, PASSWORD } from "../../fixtures/authentication";
import en from "../../../messages/en.json";

const messages = en.HomePageUnauthenticated;

describe("Login and logout", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("should be able to log in", () => {
    cy.visit("/");

    cy.contains(messages.LOG_IN).click();

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

    cy.contains(messages.LOG_IN).click();

    // TODO: examine content of authenticated homepage

    // TODO: check presence of authentication cookies
    // cy.getCookie("accessToken").should("exist");
    // cy.getCookie("refreshToken").should("exist");

    // TODO: test logout
  });
});
