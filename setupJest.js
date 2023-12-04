import { enableMocks } from "jest-fetch-mock";
import messages from "@/messages/en.json";

// https://github.com/jefflau/jest-fetch-mock#to-setup-for-all-tests
enableMocks();

// Mock `useTranslations` from next-intl
const mockUseTranslations = (namespace) => (key) => {
  const keys = key.split(".");
  let result = namespace ? messages[namespace] : messages;

  for (const k of keys) {
    result = result[k];
    if (!result) {
      return `Missing translation for ${namespace}.${key}`;
    }
  }

  return result;
};

jest.mock("next-intl", () => ({
  ...jest.requireActual("next-intl"),
  useTranslations: mockUseTranslations,
}));
