import { test, expect } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import { launchMockAPIServer } from "../utils";

const NUMBER_SEARCH_RESULTS = 50;

const configureAPIResponses = (mockAPIApp: Express) => {
  mockAPIApp.get("/api/search/", (_, response: Response) => {
    response.json({
      results: Array.from({ length: NUMBER_SEARCH_RESULTS }, (_, index) => ({
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

test("should display search results if search param is not empty", async ({
  page,
}) => {
  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await page.goto("/search/pins?q=mysearch");

  await page.waitForSelector('[data-testid="pin-thumbnail"]');
  const pinSuggestions = await page.$$('[data-testid="pin-thumbnail"]');
  expect(pinSuggestions.length).toBe(NUMBER_SEARCH_RESULTS);

  mockAPIServer.close();
});

test("should redirect to landing page if search param is empty", async ({
  page,
}) => {
  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await page.goto("/search/pins?q=");

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);

  mockAPIServer.close();
});
