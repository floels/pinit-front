import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json());

type MockResponse = {
  mockStatusCode: number;
  mockBody: {};
};

const mockResponses: Map<string, MockResponse> = new Map();

app.post("/*/configure", (request: Request, response: Response) => {
  const endpoint = request.path.replace("configure", "");
  mockResponses.set(endpoint, request.body);

  const message = `Mock response configured for ${endpoint}`;

  console.log(message);
  response.status(200).send(message);
});

app.all("*", (request: Request, response: Response) => {
  const mockResponse = mockResponses.get(request.path);
  if (mockResponse) {
    response.status(mockResponse.mockStatusCode).json(mockResponse.mockBody);
  } else {
    response.sendStatus(404);
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Mock API server is running on port ${port}`);
});
