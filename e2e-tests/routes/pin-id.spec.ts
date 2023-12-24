import { test } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import { addAccessTokenTookie, launchMockAPIServer } from "../utils";

test("should display pin details in case of successful response from the API", async ({
  page,
}) => {
  const pinID = "123456789012345";

  const pinImageURL =
    "https://i.pinimg.com/564x/7b/e8/0e/7be80e1dd312352fb3616ff285f18037.jpg";

  const configureAPIResponses = (mockAPIApp: Express) => {
    mockAPIApp.get(`/api/pins/${pinID}/`, (_, response: Response) => {
      response.json({
        unique_id: pinID,
        image_url: pinImageURL,
        title: "Pin title",
        description: "This is the pin's description.",
        author: {
          username: "johndoe",
          display_name: "John Doe",
          profile_picture_url:
            "https://i.pinimg.com/75x75_RS/62/92/1c/62921c97019ba8fa790ce3074ccaf3c6.jpg",
        },
      });
    });
  };

  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await page.goto(`/pin/${pinID}`);

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);

  await page.waitForSelector(`img[src="${pinImageURL}"]`);

  await page.waitForSelector('text="Pin title"');
  await page.waitForSelector('text="This is the pin\'s description."');

  await page.waitForSelector('text="John Doe"');
  await page.waitForSelector('img[alt="Profile picture of John Doe"]');

  mockAPIServer.close();
});

test("should display authenticated header if access token cookie is present", async ({
  page,
  context,
}) => {
  addAccessTokenTookie(context);

  await page.goto("/pin/123456789012345");

  const header = page.locator("nav");
  await header
    .locator(`text=${en.HeaderAuthenticated.NAV_ITEM_HOME}`)
    .waitFor();
});

test("should display 'pin not found' error in case of 404 response from the API", async ({
  page,
}) => {
  const pinID = "123456789012346";

  const configureAPIResponses = (mockAPIApp: Express) => {
    mockAPIApp.get(`/api/pins/${pinID}/`, (_, response: Response) => {
      response.status(404).json({
        detail: "Not found",
      });
    });
  };

  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await page.goto(`/pin/${pinID}`);

  await page.waitForSelector(`text=${en.PinDetails.ERROR_PIN_NOT_FOUND}`);

  mockAPIServer.close();
});

test("should display generic error in case API is unreachable", async ({
  page,
}) => {
  const pinID = "123456789012347";

  await page.goto(`/pin/${pinID}`);

  await page.waitForSelector(`text=${en.PinDetails.ERROR_FETCH_PIN_DETAILS}`);
});
