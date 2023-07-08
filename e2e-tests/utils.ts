import express from "express";
import cors from "cors";

export const PORT_MOCK_API_SERVER = 8000;

export const getExpressApp = () => {
  const expressApp = express();
  expressApp.use(cors());
  expressApp.use(express.json());

  return expressApp;
};
