// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  preset: "jest-puppeteer",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["json"],
};

export default createJestConfig(config);
