import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";

export const PORT_MOCK_API_SERVER = 8000;

export const getExpressApp = () => {
  const expressApp = express();

  expressApp.use(cors());
  expressApp.use(express.json());

  return expressApp;
};

export const launchMockAPIServer = (
  configureAPIResponses: (arg0: Express) => void,
) => {
  return new Promise<Server>(async (resolve, reject) => {
    const mockAPIApp = getExpressApp();

    configureAPIResponses(mockAPIApp);

    let mockAPIServer: Server;

    mockAPIServer = mockAPIApp.listen(PORT_MOCK_API_SERVER, () => {
      // Callback called upon successful server launch:
      resolve(mockAPIServer);
    });
  });
};
