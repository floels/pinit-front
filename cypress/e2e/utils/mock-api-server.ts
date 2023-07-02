import express, { Request, Response } from "express";
import cors from "cors";

// A dummy Express app that will respond to any request to /some/endpoint
// by whatever was POST-ed to /some/endpoint/configure previously

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
  const responseMessage = `Mock response configured for ${endpoint}`;
  console.log(responseMessage);
  response.status(200).send(responseMessage);
});

app.all("*", (request: Request, response: Response) => {
  const mockResponse = mockResponses.get(request.path);
  if (mockResponse) {
    response.status(mockResponse.mockStatusCode).json(mockResponse.mockBody);
  } else {
    console.log(
      `Warning: path "${request.path}" was not properly configured before being called.`
    );
    response.sendStatus(404);
  }
});

app.listen(8000);
