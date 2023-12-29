import { test } from "@playwright/test";
import { Response, Express } from "express";
import { addAccessTokenTookie, launchMockAPIServer } from "../utils";
import en from "@/messages/en.json";

test("should display account details", async ({ page }) => {
  const accountDescription =
    "This is the description of John Doe's personal account.";

  const configureAPIResponses = (mockAPIApp: Express) => {
    mockAPIApp.get(`/api/accounts/johndoe/`, (_, response: Response) => {
      response.json({
        username: "johndoe",
        type: "personal",
        display_name: "John Doe",
        profile_picture_url:
          "https://i.pinimg.com/75x75_RS/62/92/1c/62921c97019ba8fa790ce3074ccaf3c6.jpg",
        background_picture_url: null,
        description: accountDescription,
      });
    });
  };

  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await page.goto(`/johndoe`);

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);

  await page.waitForSelector('img[alt="Profile picture of John Doe"]');

  await page.waitForSelector('text="John Doe"');

  await page.waitForSelector('text="johndoe"');

  await page.waitForSelector(`text="${accountDescription}"`);

  mockAPIServer.close();
});

test("should display authenticated header if access token cookie is present", async ({
  page,
  context,
}) => {
  addAccessTokenTookie({ context });

  await page.goto("/johndoe");

  const header = page.locator("nav");
  await header
    .locator(`text=${en.HeaderAuthenticated.NAV_ITEM_HOME}`)
    .waitFor();
});
