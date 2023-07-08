import { test, expect, Page } from "@playwright/test";
import { Request, Response, Express } from "express";
import { Server } from "http";
import en from "@/messages/en.json";
import { PORT_MOCK_API_SERVER, getExpressApp } from "./utils";

const EMAIL_FIXTURE = "john.doe@example.com";
const PASSWORD_FIXTURE = "Pa$$w0rd";

let mockAPIApp: Express;
let mockAPIServer: Server;

const configureAPIResponses = () => {
  mockAPIApp.post(
    "/api/token/obtain/",
    (request: Request, response: Response) => {
      response.json({
        access_token: "mock_access_token",
        refresh_token: "mock_refresh_token",
      });
    }
  );

  mockAPIApp.get("/api/accounts/", (request: Request, response: Response) => {
    response.json({
      results: [
        {
          type: "personal",
          username: "johndoe",
          display_name: "John Doe",
          initial: "J",
          owner_email: "john.doe@example.com",
        },
      ],
    });
  });

  mockAPIApp.get(
    "/api/pin-suggestions/",
    (request: Request, response: Response) => {
      if (request.query.page) {
        response.status(404).send();
      } else {
        response.json({
          results: Array.from({ length: 100 }, (_, index) => ({
            id: index + 1,
            image_url: "https://some.url",
            title: "",
            description: "",
            author: {
              username: "johndoe",
              display_name: "John Doe",
            },
          })),
        });
      }
    }
  );
};

const launchMockAPIServer = () => {
  mockAPIApp = getExpressApp();

  configureAPIResponses();

  mockAPIServer = mockAPIApp.listen(PORT_MOCK_API_SERVER);
};

const checkCookieValue = async (
  page: Page,
  cookieName: string,
  expectedValue: string | null
) => {
  const cookie = await page
    .context()
    .cookies()
    .then((cookies) => cookies.find((cookie) => cookie.name === cookieName));

  if (expectedValue) {
    expect(cookie?.value).toBe(expectedValue);
  } else {
    expect(cookie).toBeUndefined();
  }
};

test("Can log in and then log out", async ({ page }) => {
  launchMockAPIServer();

  // Visit home page and log in
  await page.goto("/");

  await page.click(`text=${en.HomePageUnauthenticated.Header.LOG_IN}`);

  await page.fill("input[name='email']", EMAIL_FIXTURE);
  await page.fill("input[name='password']", PASSWORD_FIXTURE);

  await page.click(
    `text=${en.HomePageUnauthenticated.Header.LoginForm.LOG_IN}`
  );

  // We should land on authenticated homepage
  await page.waitForSelector(
    `text=${en.HomePageAuthenticated.Header.NAV_ITEM_HOME}`
  );

  // Check presence of authentication cookies
  await checkCookieValue(page, "accessToken", "mock_access_token");
  await checkCookieValue(page, "refreshToken", "mock_refresh_token");

  // Necessary to wait for this, otherwise account options button won't be interactive
  await page.waitForSelector('[data-testid="pin-suggestions-container"] img');

  // Log out
  await page.click('[data-testid="account-options-button"]');
  await page.click(
    `text=${en.HomePageAuthenticated.Header.AccountOptionsFlyout.LOG_OUT}`
  );

  // We should land back on unauthenticated homepage
  await page.waitForSelector(
    `text=${en.HomePageUnauthenticated.Header.LOG_IN}`
  );

  // Check absence of authentication cookies
  await checkCookieValue(page, "accessToken", null);
  await checkCookieValue(page, "refreshToken", null);

  // Close mock API server
  mockAPIServer.close();
});
