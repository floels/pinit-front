import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";
import { BrowserContext } from "@playwright/test";

export const PORT_MOCK_API_SERVER = 8000;

export const getExpressApp = () => {
  const expressApp = express();

  expressApp.use(cors());
  expressApp.use(express.json());

  return expressApp;
};

export const launchMockAPIServer = (
  configureAPIResponses: (mockAPIApp: Express) => void,
) => {
  return new Promise<Server>(async (resolve) => {
    const mockAPIApp = getExpressApp();

    configureAPIResponses(mockAPIApp);

    let mockAPIServer: Server;

    mockAPIServer = mockAPIApp.listen(PORT_MOCK_API_SERVER, () => {
      // Callback called upon successful server launch:
      resolve(mockAPIServer);
    });
  });
};

export const addAccessTokenTookie = ({
  context,
}: {
  context: BrowserContext;
}) => {
  context.addCookies([
    {
      name: "accessToken",
      value: "dummy_access_token",
      path: "/",
      domain: "127.0.0.1",
      httpOnly: true,
      secure: true,
    },
  ]);
};

export const addRefreshTokenTookie = ({
  context,
}: {
  context: BrowserContext;
}) => {
  context.addCookies([
    {
      name: "refreshToken",
      value: "dummy_refresh_token",
      path: "/",
      domain: "127.0.0.1",
      httpOnly: true,
      secure: true,
    },
  ]);
};
