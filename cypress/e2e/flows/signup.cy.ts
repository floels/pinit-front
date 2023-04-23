import { EMAIL_ADDRESS, PASSWORD } from "../../fixtures/authentication";
import en from "../../../messages/en.json";

const messages = en.HomePageUnauthenticated;

describe("Signup", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("should be able to sign up", () => {
    cy.visit("/");

    cy.contains(messages.SIGN_UP).click();

    cy.get("input[name='email']").type(EMAIL_ADDRESS);
    cy.get("input[name='password']").type(PASSWORD);
    cy.get("input[name='birthdate']").type("1970-01-01");

    cy.intercept(
      {
        method: "POST",
        url: "/api/signup",
      },
      {
        statusCode: 200,
        body: {
          access: "access_token",
          refresh: "refresh_token",
        },
      }
    );

    cy.contains(messages.CONTINUE).click();

    // TODO: examine content of authenticated homepage

    // TODO: check presence of authentication cookies
    // cy.getCookie("accessToken").should("exist");
    // cy.getCookie("refreshToken").should("exist");
  });
});
