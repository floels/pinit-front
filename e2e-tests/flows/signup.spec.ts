import { test } from "@playwright/test";
import { Response, Express } from "express";
import { Server } from "http";
import en from "@/messages/en.json";
import { PORT_MOCK_API_SERVER, getExpressApp } from "@/e2e-tests/utils";

const EMAIL_FIXTURE = "john.doe@example.com";
const PASSWORD_FIXTURE = "Pa$$w0rd";
const BIRTHDATE_FIXTURE = "1970-01-01";

let mockAPIApp: Express;
let mockAPIServer: Server;

const configureAPIResponses = () => {
  mockAPIApp.post("/api/signup/", (_, response: Response) => {
    response.json({
      access_token: "mock_access_token",
      refresh_token: "mock_refresh_token",
    });
  });
};

const launchMockAPIServer = () => {
  return new Promise<void>((resolve) => {
    mockAPIApp = getExpressApp();

    configureAPIResponses();

    mockAPIServer = mockAPIApp.listen(PORT_MOCK_API_SERVER, resolve);
  });
};

test("User should be able to sign up", async ({ page }) => {
  await launchMockAPIServer();

  await page.goto("/");

  await page.click(`text=${en.HomePageUnauthenticated.Header.SIGN_UP}`);

  await page.fill("input[name='email']", EMAIL_FIXTURE);
  await page.fill("input[name='password']", PASSWORD_FIXTURE);
  await page.fill("input[name='birthdate']", BIRTHDATE_FIXTURE);

  await page.click(`text=${en.HomePageUnauthenticated.SignupForm.CONTINUE}`);

  // We should land on authenticated homepage
  await page.waitForSelector(
    `text=${en.HomePageAuthenticated.Header.NAV_ITEM_HOME}`,
  );

  // If we visit the base route again, we should still land on the authenticated homepage
  await page.goto("/");

  await page.waitForSelector(
    `text=${en.HomePageAuthenticated.Header.NAV_ITEM_HOME}`,
  );

  // Close mock API server
  mockAPIServer.close();
});
