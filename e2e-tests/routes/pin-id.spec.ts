import { test } from "@playwright/test";
import en from "@/messages/en.json";

test("should redirect to landing page if user is not logged in", async ({
  page,
}) => {
  await page.goto("/pin/123456");

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);
});
