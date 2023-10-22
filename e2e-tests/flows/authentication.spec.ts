import { test } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import { launchMockAPIServer } from "@/e2e-tests/utils";

const EMAIL_FIXTURE = "john.doe@example.com";
const PASSWORD_FIXTURE = "Pa$$w0rd";

const configureAPIResponses = (mockAPIApp: Express) => {
  mockAPIApp.post("/api/token/obtain/", (_, response: Response) => {
    response.json({
      access_token: "mock_access_token",
      refresh_token: "mock_refresh_token",
    });
  });

  mockAPIApp.get("/api/pins/suggestions/", (_, response: Response) => {
    response.json({
      results: [],
    });
  });
};

test("user should be able to log in and then log out", async ({ page }) => {
  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  // Visit home page and log in
  await page.goto("/");

  await page.click('[data-testid="header-log-in-button"]');

  await page.fill(
    "div[data-testid='overlay-modal'] >> input[name='email']",
    EMAIL_FIXTURE,
  );
  await page.fill(
    "div[data-testid='overlay-modal'] >> input[name='password']",
    PASSWORD_FIXTURE,
  );

  await page.click(
    `div[data-testid="overlay-modal"] >> text=${en.LandingPage.LoginForm.LOG_IN}`,
  );

  // We should land on authenticated homepage
  await page.waitForSelector('[data-testid="search-bar-input"]');

  // Log out
  await page.click('[data-testid="account-options-button"]');
  await page.click(`text=${en.HomePage.Header.AccountOptionsFlyout.LOG_OUT}`);

  // We should land back on landing page
  await page.waitForSelector(`text=${en.LandingPage.Header.LOG_IN}`);

  // If we visit the base route again, we should still land on the landing page
  await page.goto("/");

  await page.waitForSelector(`text=${en.LandingPage.Header.LOG_IN}`);

  mockAPIServer.close();
});
