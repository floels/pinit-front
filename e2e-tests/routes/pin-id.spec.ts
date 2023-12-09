import { test } from "@playwright/test";
import en from "@/messages/en.json";

test("should redirect to landing page if pin ID doesn't match pattern", async ({
  page,
}) => {
  await page.goto("/pin/123456");

  await page.waitForSelector(`text=${en.HeaderUnauthenticated.LOG_IN}`);
});
