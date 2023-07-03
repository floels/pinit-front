/**
 * @jest-environment puppeteer
 */

import { Request, Response, Express } from "express";
import { ElementHandle } from "puppeteer";
import { Server } from "http";
import en from "@/messages/en.json";
import { PORT_MOCK_API_SERVER, getExpressApp } from "../utils/utils";

const EMAIL_FIXTURE = "john.doe@example.com";
const PASSWORD_FIXTURE = "Pa$$w0rd";

let mockAPIApp: Express;
let mockAPIServer: Server;

const configureAPIResponses = () => {
  mockAPIApp.post(
    "/api/token/obtain/",
    (request: Request, response: Response) => {
      response.json({
        access_token: "mock_access_token",
        refresh_token: "mock_refresh_token",
      });
    }
  );

  mockAPIApp.get("/api/accounts/", (request: Request, response: Response) => {
    response.json({
      results: [
        {
          type: "personal",
          username: "johndoe",
          display_name: "John Doe",
          initial: "J",
          owner_email: "john.doe@example.com",
        },
      ],
    });
  });

  mockAPIApp.get(
    "/api/pin-suggestions/",
    (request: Request, response: Response) => {
      if (request.query.page) {
        response.status(404).send();
      } else {
        response.json({
          results: Array.from({ length: 100 }, (_, index) => ({
            id: index + 1,
            image_url: "https://some.url",
            title: "",
            description: "",
            author: {
              username: "johndoe",
              display_name: "John Doe",
            },
          })),
        });
      }
    }
  );
};

describe("Authentication", () => {
  beforeAll(async () => {
    mockAPIApp = getExpressApp();

    configureAPIResponses();

    mockAPIServer = mockAPIApp.listen(PORT_MOCK_API_SERVER);
  });

  afterAll(() => {
    mockAPIServer.close();
  });

  test("should load unauthenticated homepage", async () => {
    await page.goto("http://localhost:3000/");

    // Click login button
    await expect(page).toClick("button", {
      text: en.HomePageUnauthenticated.Header.LOG_IN,
    });

    // Fill in login form and submit
    await expect(page).toFill("input[name='email']", EMAIL_FIXTURE);
    await expect(page).toFill("input[name='password']", PASSWORD_FIXTURE);
    await expect(page).toClick("button", {
      text: en.HomePageUnauthenticated.Header.LoginForm.LOG_IN,
    });

    // We should land on authenticated homepage
    await page.waitForSelector(
      `text=${en.HomePageAuthenticated.Header.NAV_ITEM_HOME}`
    );

    // Check presence of authentication cookies
    let cookies = await page.cookies();
    let accessTokenCookie = cookies.find(
      (cookie) => cookie.name === "accessToken"
    );
    let refreshTokenCookie = cookies.find(
      (cookie) => cookie.name === "refreshToken"
    );
    expect(accessTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();

    // Necessary to wait for this, otherwise account options button won't be interactive
    await page.waitForSelector('[data-testid="pin-suggestions-container"] img');

    // Log out
    await expect(page).toClick('[data-testid="account-options-button"]');

    const logoutElements = await page.$x(
      `//div[contains(text(), '${en.HomePageAuthenticated.Header.AccountOptionsFlyout.LOG_OUT}')]`
    );
    const logoutButton = logoutElements[0] as ElementHandle;
    await logoutButton.click();

    // We should land back on unauthenticated homepage
    await page.waitForSelector(
      `text=${en.HomePageUnauthenticated.Header.LOG_IN}`
    );

    // Authentication cookies should be cleared
    cookies = await page.cookies();
    accessTokenCookie = cookies.find((cookie) => cookie.name === "accessToken");
    refreshTokenCookie = cookies.find(
      (cookie) => cookie.name === "refreshToken"
    );
    expect(accessTokenCookie).toBeUndefined();
    expect(refreshTokenCookie).toBeUndefined();
  });
});
