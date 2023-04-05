import { EMAIL_ADDRESS, PASSWORD } from "@/cypress/fixtures/authentication";
import en from "../../../lang/en.json";

describe("Signup", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("should be able to sign up", () => {
    cy.visit("/");

    cy.contains(en.SIGN_UP).click();

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

    cy.contains(en.CONTINUE).click();

    // TODO: examine content of authenticated homepage

    // TODO: check presence of authentication cookies
    // cy.getCookie("accessToken").should("exist");
    // cy.getCookie("refreshToken").should("exist");
  });
});
