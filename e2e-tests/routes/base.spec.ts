import { test, expect } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import {
  addAccessTokenTookie,
  addRefreshTokenTookie,
  launchMockAPIServer,
} from "../utils";
import {
  ERROR_CODE_INVALID_REFRESH_TOKEN,
  ERROR_CODE_UNAUTHORIZED,
} from "@/lib/constants";

test("should display landing page if user is not logged in", async ({
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
    mockAPIApp.get("/api/owned-accounts/", (_, response: Response) => {
      response.json({
        results: [
          {
            username: "johndoe",
            display_name: "John Doe",
            type: "personal",
            initial: "J",
            profile_picture_url: null,
          },
        ],
      });
    });

    mockAPIApp.get("/api/pin-suggestions/", (_, response: Response) => {
      response.json({
        results: Array.from({ length: NUMBER_PIN_SUGGESTIONS }, (_, index) => ({
          unique_id: index + 1,
          image_url: "https://some.url",
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

  await page.click('[data-testid="account-options-button"]');

  // Wait for fetch to be complete:
  await page.waitForSelector('[data-testid="owned-accounts-spinner"]', {
    state: "detached",
  });

  const accountOptionsFlyout = page.locator(
    '[data-testid="account-options-flyout"]',
  );
  await accountOptionsFlyout.locator('text="John Doe"').waitFor();
  await accountOptionsFlyout.locator('text="Personal"').waitFor();

  // Close account options flyout:
  await page.click('[data-testid="account-options-button"]');

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

test("should display error message when server is unreachable", async ({
  page,
  context,
}) => {
  // We set an 'accessToken' cookie so that the page tries to reach the server.
  addAccessTokenTookie({ context });

  // We don't launch a mock API server for this test, which simulates an unreachable server.

  await page.goto("/");

  await page.waitForSelector(
    `text=${en.HomePageContent.ERROR_FETCH_PIN_SUGGESTIONS}`,
  );
});
