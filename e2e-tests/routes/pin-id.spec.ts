import { test, expect } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import { launchMockAPIServer } from "../utils";

test("should display pin details if pin ID matches pattern", async ({
  page,
}) => {
  const pinID = "123456789012345";

  const configureAPIResponses = (mockAPIApp: Express) => {
    mockAPIApp.get(`/api/pins/${pinID}/`, (_, response: Response) => {
      response.json({
        unique_id: pinID,
        image_url: "https://i.pinimg.com/pinImageID",
        title: "Pin title",
        description: "This is the pin's description.",
        author: {
          username: "johndoe",
          display_name: "John Doe",
          profile_picture_url: "https://i.pinimg.com/profilePictureImageID",
        },
      });
    });
  };

  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await page.goto(`/pin/${pinID}`);

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);

  await page.waitForSelector('img[src="https://i.pinimg.com/pinImageID"]');

  await page.waitForSelector('text="Pin title"');
  await page.waitForSelector('text="This is the pin\'s description."');

  await page.waitForSelector('text="John Doe"');
  await page.waitForSelector('img[alt="Profile picture of John Doe"]');

  mockAPIServer.close();
});

test("should redirect to landing page if pin ID doesn't match pattern", async ({
  page,
}) => {
  await page.goto("/pin/123456");

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);
  await page.waitForSelector(
    `text=${en.LandingPageContent.PictureSlider.GET_YOUR_NEXT}`,
  );
});
