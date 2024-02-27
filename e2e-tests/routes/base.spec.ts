import { test, expect } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import {
  addAccessTokenTookie,
  addRefreshTokenTookie,
  launchMockAPIServer,
} from "../utils";
import { ERROR_CODE_INVALID_REFRESH_TOKEN } from "@/lib/constants";
import { PIN_IMAGE_URL } from "../fixtures/constants";

test("should display unauthenticated header and landing page content if user is not logged in", async ({
  page,
}) => {
  await page.goto("/");

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);
  await page.waitForSelector(
    `text=${en.LandingPageContent.PictureSlider.GET_YOUR_NEXT}`,
  );
});

test("should display owned accounts and pin suggestions if user is logged in", async ({
  page,
  context,
}) => {
  const NUMBER_PIN_SUGGESTIONS = 50;

  const configureAPIResponses = (mockAPIApp: Express) => {
    mockAPIApp.post("/api/token/refresh/", (_, response: Response) => {
      response.json({
        access_token: "refreshed_access_token",
      });
    });

    mockAPIApp.get("/api/pin-suggestions/", (_, response: Response) => {
      response.json({
        results: Array.from({ length: NUMBER_PIN_SUGGESTIONS }, (_, index) => ({
          unique_id: index + 1,
          image_url: PIN_IMAGE_URL,
          title: "",
          description: "",
          author: {
            username: "johndoe",
            display_name: "John Doe",
          },
        })),
      });
    });
  };

  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  addAccessTokenTookie({ context });

  await page.goto("/");

  const header = page.locator("nav");
  await header
    .locator(`text=${en.HeaderAuthenticated.NAV_ITEM_HOME}`)
    .waitFor();

  await page.waitForSelector('[data-testid="pin-thumbnail"]');
  const pinSuggestions = await page.$$('[data-testid="pin-thumbnail"]');
  expect(pinSuggestions.length).toBe(NUMBER_PIN_SUGGESTIONS);

  mockAPIServer.close();
});

test("should log user out when refresh token is expired", async ({
  page,
  context,
}) => {
  const configureAPIResponses = (mockAPIApp: Express) => {
    mockAPIApp.post("/api/token/refresh/", (_, response: Response) => {
      response.status(401).json({
        errors: [{ code: ERROR_CODE_INVALID_REFRESH_TOKEN }],
      });
    });
  };

  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  addAccessTokenTookie({ context });
  addRefreshTokenTookie({ context });

  await page.goto("/");

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);

  mockAPIServer.close();
});

test("should display error message when API is unreachable", async ({
  page,
  context,
}) => {
  // We set an 'accessToken' cookie so that the page tries to reach the server.
  addAccessTokenTookie({ context });

  await page.goto("/");

  await page.waitForSelector(
    `text=${en.HomePageContent.ERROR_FETCH_PIN_SUGGESTIONS}`,
  );
});
