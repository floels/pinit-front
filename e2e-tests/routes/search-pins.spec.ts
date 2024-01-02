import { test, expect } from "@playwright/test";
import { Request, Response, Express } from "express";
import en from "@/messages/en.json";
import { launchMockAPIServer } from "../utils";

const NUMBER_SEARCH_RESULTS = 50;

const configureAPIResponses = (mockAPIApp: Express) => {
  mockAPIApp.get("/api/search/", (request: Request, response: Response) => {
    const searchParam = request.query.q;

    if (searchParam === "mysearch") {
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
    } else {
      response.status(400).json({});
    }
  });
};

let mockAPIServer: any;

test.beforeAll(async () => {
  mockAPIServer = await launchMockAPIServer(configureAPIResponses);
});

test("should display search results upon successful response from the API", async ({
  page,
}) => {
  await page.goto("/search/pins?q=mysearch");

  await page.waitForSelector('[data-testid="pin-thumbnail"]');
  const pinSuggestions = await page.$$('[data-testid="pin-thumbnail"]');
  expect(pinSuggestions.length).toBe(NUMBER_SEARCH_RESULTS);

  mockAPIServer.close();
});

test("should display generic error upon KO response from the API", async ({
  page,
}) => {
  await page.goto("/search/pins?q=KOsearch");

  await page.waitForSelector(
    `text=${en.PinsSearch.ERROR_FETCH_SEARCH_RESULTS}`,
  );
});

test("should redirect to landing page if search param is empty", async ({
  page,
}) => {
  await page.goto("/search/pins?q=");

  await page.waitForSelector(
    `text=${en.LandingPageContent.PictureSlider.GET_YOUR_NEXT}`,
  );
});

test.afterAll(() => {
  mockAPIServer.close();
});
