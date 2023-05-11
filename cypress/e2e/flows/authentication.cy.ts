import { EMAIL_ADDRESS, PASSWORD } from "../../fixtures/authentication";
import { API_BASE_URL } from "../../../lib/constants";
import en from "../../../messages/en.json";
import { responseSVGPictureSliderImageMock } from "../../fixtures/images";
import { URL_PATTERN_UNAUTHENTICATED_HOMEPAGE_PICTURE_SLIDER_IMAGES } from "../utils/constants";

describe("Authentication", () => {
  beforeEach(() => {
    cy.clearCookies();
  });

  it("should be able to log in and then log out", () => {
    // Configure mock API response
    cy.request({
      method: "POST",
      url: `${API_BASE_URL}/token/configure`,
      body: {
        mockStatusCode: 200,
        mockBody: {
          access_token: "mock_access_token",
          refresh_token: "mock_refresh_token",
        },
      },
    });

    // Mock picture slider images (hosted in S3 bucket) for better performance:
    cy.intercept(URL_PATTERN_UNAUTHENTICATED_HOMEPAGE_PICTURE_SLIDER_IMAGES, {
      fixture: "dummy_image_landing_page_pictures_slider.jpeg",
    });

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
