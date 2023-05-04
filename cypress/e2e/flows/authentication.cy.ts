import { EMAIL_ADDRESS, PASSWORD } from "../../fixtures/authentication";
// import { getLocal } from "mockttp";
import en from "../../../messages/en.json";

// const mockServer = getLocal();

describe("Authentication", () => {
  beforeEach(() => {
    cy.clearCookies();

    // mockServer.start(8000);

    // const responseTokenEndpoint = {
    //   access: "access_token",
    //   refresh: "refresh_token",
    // };
    // mockServer
    //   .forPost("/api/token")
    //   .thenReply(200, JSON.stringify(responseTokenEndpoint));

    // const responseUserDetailsEndpoint = {
    //   email: "john.doe@example.com",
    //   initial: "J",
    //   firstName: "John",
    //   lastName: "Doe",
    // };
    // mockServer
    //   .forGet("/api/user-details")
    //   .thenReply(200, JSON.stringify(responseUserDetailsEndpoint));
  });

  // afterEach(() => {
  //   mockServer.stop();
  // });

  it("should be able to log in and then log out", () => {
    cy.visit("/");

    cy.contains(en.HomePageUnauthenticated.LOG_IN).click();

    cy.get("input[name='email']").type(EMAIL_ADDRESS);
    cy.get("input[name='password']").type(PASSWORD);

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
