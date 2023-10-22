import { test, expect } from "@playwright/test";
import { Response, Express } from "express";
import en from "@/messages/en.json";
import { launchMockAPIServer } from "../utils";

const NUMBER_PIN_SUGGESTIONS = 50;

const configureAPIResponses = (mockAPIApp: Express) => {
  mockAPIApp.get("/api/pins/suggestions/", (_, response: Response) => {
    response.json({
      results: Array.from({ length: NUMBER_PIN_SUGGESTIONS }, (_, index) => ({
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

test("should display pin suggestions if user is logged in", async ({
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

  await page.goto("/");

  await page.waitForSelector('[data-testid="pin-thumbnail"]');
  const pinSuggestions = await page.$$('[data-testid="pin-thumbnail"]');
  expect(pinSuggestions.length).toBe(NUMBER_PIN_SUGGESTIONS);

  mockAPIServer.close();
});

test("should display error message when server is unreachable", async ({
  page,
  context,
}) => {
  // We set an 'accessToken' cookie so that the page tries to reach the server.
  // We don't launch a mock API server for this test, which simulates an unreachable server.
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

  await page.goto("/");

  await page.waitForSelector(`text=${en.HomePage.Content.ERROR_DISPLAY_PINS}`);
});
