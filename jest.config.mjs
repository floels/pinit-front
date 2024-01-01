// https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  // https://github.com/jefflau/jest-fetch-mock#to-setup-for-all-tests
  setupFiles: ["./setupJest.js"],
  setupFilesAfterEnv: ["./setupJestAfterEnv.js"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["<rootDir>/e2e-tests/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
};

export default createJestConfig(config);
