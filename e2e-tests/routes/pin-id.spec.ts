import { test } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import { launchMockAPIServer } from "../utils";

const pinImageURL =
  "https://i.pinimg.com/564x/7b/e8/0e/7be80e1dd312352fb3616ff285f18037.jpg";

const PIN_ID_OK = "123456789012345";
const PIN_ID_404 = "404404404404404";
const PIN_ID_400 = "400400400400400";

const configureAPIResponses = (mockAPIApp: Express) => {
  mockAPIApp.get(`/api/pins/${PIN_ID_OK}/`, (_, response: Response) => {
    response.json({
      unique_id: PIN_ID_OK,
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

  mockAPIApp.get(`/api/pins/${PIN_ID_404}/`, (_, response: Response) => {
    response.status(404).json({});
  });

  mockAPIApp.get(`/api/pins/${PIN_ID_400}/`, (_, response: Response) => {
    response.status(400).json({});
  });
};

let mockAPIServer: any;

test.beforeAll(async () => {
  mockAPIServer = await launchMockAPIServer(configureAPIResponses);
});

test("should display pin details in case of successful response from the API", async ({
  page,
}) => {
  await page.goto(`/pin/${PIN_ID_OK}`);

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);

  await page.waitForSelector(`img[src="${pinImageURL}"]`);

  await page.waitForSelector('text="Pin title"');
  await page.waitForSelector('text="This is the pin\'s description."');

  await page.waitForSelector('text="John Doe"');
  await page.waitForSelector('img[alt="Profile picture of John Doe"]');
});

test("should display 'pin not found' error in case of 404 response from the API", async ({
  page,
}) => {
  await page.goto(`/pin/${PIN_ID_404}`);

  await page.waitForSelector(`text=${en.PinDetails.ERROR_PIN_NOT_FOUND}`);
});

test("should display generic error in case of 400 response from the API", async ({
  page,
}) => {
  await page.goto(`/pin/${PIN_ID_400}`);

  await page.waitForSelector(`text=${en.PinDetails.ERROR_FETCH_PIN_DETAILS}`);
});

test.afterAll(() => {
  mockAPIServer.close();
});
