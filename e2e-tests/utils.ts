import express from "express";
import cors from "cors";
import { Page, expect } from "@playwright/test";

export const PORT_MOCK_API_SERVER = 8000;

export const getExpressApp = () => {
  const expressApp = express();

  expressApp.use(cors());
  expressApp.use(express.json());

  return expressApp;
};

export const checkCookieValue = async (
  page: Page,
  cookieName: string,
  expectedValue: string | null
) => {
  const cookie = await page
    .context()
    .cookies()
    .then((cookies) => cookies.find((cookie) => cookie.name === cookieName));

  if (expectedValue) {
    expect(cookie?.value).toBe(expectedValue);
  } else {
    expect(cookie).toBeUndefined();
  }
};
