import express, { Express } from "express";
import { Server } from "http";
import cors from "cors";
import { check } from "tcp-port-used";

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
    const isPortInUse = await check(PORT_MOCK_API_SERVER);

    if (isPortInUse) {
      reject(
        `Can't launch mock API server: port ${PORT_MOCK_API_SERVER} is already in use.`,
      );
      return;
    }

    const mockAPIApp = getExpressApp();

    configureAPIResponses(mockAPIApp);

    let mockAPIServer: Server;

    mockAPIServer = mockAPIApp.listen(PORT_MOCK_API_SERVER, () => {
      // Callback called upon successful server launch:
      resolve(mockAPIServer);
    });
  });
};
