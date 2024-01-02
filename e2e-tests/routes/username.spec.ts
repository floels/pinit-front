import { test } from "@playwright/test";
import { Response, Express } from "express";
import { launchMockAPIServer } from "../utils";
import en from "@/messages/en.json";

const configureAPIResponses = (mockAPIApp: Express) => {
  mockAPIApp.get(`/api/accounts/johndoe/`, (_, response: Response) => {
    response.json({
      username: "johndoe",
      type: "personal",
      display_name: "John Doe",
      profile_picture_url:
        "https://i.pinimg.com/75x75_RS/62/92/1c/62921c97019ba8fa790ce3074ccaf3c6.jpg",
      background_picture_url: null,
      description: "John Doe account description",
    });
  });

  mockAPIApp.get("/api/accounts/doesnotexist/", (_, response: Response) => {
    response.status(404).json({});
  });

  mockAPIApp.get("/api/accounts/badrequest/", (_, response: Response) => {
    response.status(400).json({});
  });
};

let mockAPIServer: any;

test.beforeAll(async () => {
  mockAPIServer = await launchMockAPIServer(configureAPIResponses);
});

test("should display account details", async ({ page }) => {
  await page.goto("/johndoe");

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);

  await page.waitForSelector('img[alt="Profile picture of John Doe"]');

  await page.waitForSelector('text="John Doe"');
  await page.waitForSelector('text="johndoe"');
  await page.waitForSelector('text="John Doe account description"');
});

test("should display 'account not found' error in case of 404 response from the API", async ({
  page,
}) => {
  await page.goto("/doesnotexist");

  await page.waitForSelector(
    `text=${en.AccountDetails.ERROR_ACCOUNT_NOT_FOUND}`,
  );
});

test("should display generic error in case of 400 response from the API", async ({
  page,
}) => {
  await page.goto("/badrequest");

  await page.waitForSelector(
    `text=${en.AccountDetails.ERROR_FETCH_ACCOUNT_DETAILS}`,
  );
});

test.afterAll(() => {
  mockAPIServer.close();
});
