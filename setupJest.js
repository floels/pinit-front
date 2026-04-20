import { enableMocks } from "jest-fetch-mock";

// https://github.com/jefflau/jest-fetch-mock#to-setup-for-all-tests
enableMocks();

// Mock react-i18next — resolves keys against the actual namespace JSON files
// so that test assertions can match the real translated strings.
jest.mock("react-i18next", () => {
  const allNamespaces = {
    Common: require("./public/locales/en/Common.json"),
    HeaderUnauthenticated: require("./public/locales/en/HeaderUnauthenticated.json"),
    HeaderAuthenticated: require("./public/locales/en/HeaderAuthenticated.json"),
    LandingPageContent: require("./public/locales/en/LandingPageContent.json"),
    HomePageContent: require("./public/locales/en/HomePageContent.json"),
    PinsSearch: require("./public/locales/en/PinsSearch.json"),
    PinsBoard: require("./public/locales/en/PinsBoard.json"),
    PinDetails: require("./public/locales/en/PinDetails.json"),
    AccountDetails: require("./public/locales/en/AccountDetails.json"),
    BoardDetails: require("./public/locales/en/BoardDetails.json"),
    PinCreation: require("./public/locales/en/PinCreation.json"),
  };

  const lookupKey = (nsObj, key) => {
    const parts = key.split(".");
    let result = nsObj;
    for (const part of parts) {
      if (result && typeof result === "object") {
        result = result[part];
      } else {
        return key;
      }
    }
    return typeof result === "string" ? result : key;
  };

  const mockT = (defaultNsObj) => (key, opts) => {
    // "NS:KEY" prefix syntax
    if (typeof key === "string" && key.includes(":")) {
      const colonIdx = key.indexOf(":");
      const ns = key.slice(0, colonIdx);
      const rest = key.slice(colonIdx + 1);
      return lookupKey(allNamespaces[ns] || {}, rest);
    }
    // { ns: "NS" } option
    if (opts && opts.ns) {
      return lookupKey(allNamespaces[opts.ns] || {}, key);
    }
    return lookupKey(defaultNsObj || allNamespaces["Common"], key);
  };

  const useTranslation = (ns) => {
    const primary = Array.isArray(ns) ? ns[0] : ns;
    const nsObj = allNamespaces[primary] || allNamespaces["Common"];
    return { t: mockT(nsObj), i18n: { language: "en" } };
  };

  return {
    useTranslation,
    Trans: ({ children }) => children,
    initReactI18next: { type: "3rdParty", init: () => {} },
  };
});
