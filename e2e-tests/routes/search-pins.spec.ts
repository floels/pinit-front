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

  mockAPIApp.get("/api/pin-suggestions/", (_, response: Response) => {
    response.json({
      results: [],
    });
  });
};

test("should display search results if user is logged in", async ({
  page,
  context,
}) => {
  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await context.addCookies([
    {
      name: "accessToken",
      value: "dummy_access_token",
      path: "/",
      domain: "127.0.0.1",
      httpOnly: true,
      secure: true,
    },
  ]);

  await page.goto("/search/pins?q=mysearch");

  await page.waitForSelector('[data-testid="pin-thumbnail"]');
  const pinSuggestions = await page.$$('[data-testid="pin-thumbnail"]');
  expect(pinSuggestions.length).toBe(NUMBER_SEARCH_RESULTS);

  mockAPIServer.close();
});

test("should redirect to homepage if search is empty and user is logged in", async ({
  page,
  context,
}) => {
  const mockAPIServer = await launchMockAPIServer(configureAPIResponses);

  await context.addCookies([
    {
      name: "accessToken",
      value: "dummy_access_token",
      path: "/",
      domain: "127.0.0.1",
      httpOnly: true,
      secure: true,
    },
  ]);

  await page.goto("/search/pins?q=");

  await page.waitForSelector('[data-testid="search-bar-input"]');

  mockAPIServer.close();
});

test("should redirect to landing page if user is not logged in", async ({
  page,
}) => {
  await page.goto("/search/pins?q=mysearch");

  await page.waitForSelector(`text=${en.LandingPage.Header.LOG_IN}`);
});
