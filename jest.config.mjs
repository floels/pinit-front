// see https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ["./mocks/globalMocks.js"],
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage/jest",
  coverageReporters: ["json"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
