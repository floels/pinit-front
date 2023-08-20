import { test } from "@playwright/test";
import en from "@/messages/en.json";

test("Homepage should display warning toast when server is unreachable", async ({
  page,
  context,
}) => {
  // We set an 'accessToken' cookie so that the page tries to reach the server
  // Since there is no server running on the API URL, this will simulate an unreachable server
  await context.addCookies([
    {
      name: "accessToken",
      value: "dummy_access_token",
      path: "/",
      domain: "127.0.0.1",
    },
  ]);

  await page.goto("/");

  await page.waitForSelector(`text=${en.Common.CONNECTION_ERROR}`);
});
