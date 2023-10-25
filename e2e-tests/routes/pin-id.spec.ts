import { test } from "@playwright/test";

test("should redirect to base route if user is not logged in", async ({
  page,
}) => {
  await page.goto("/pin/123456");

  await page.waitForURL("/");
});
