import _ from "lodash";
import { getTranslationsObjectFromDefaultTranslations } from "./i18n";

describe("getTranslationsObjectFromDefaultTranslations function", () => {
  it("should correctly translate the nested object structure", () => {
    const defaultTranslations = {
      HomePageUnauthenticated: {
        WELCOME: "Welcome to Pinit",
        Header: {
          SIGN_UP: "Sign up",
          LOG_IN: "Log in",
        },
      },
    };
    const namespace = "HomePageUnauthenticated";
    const dummyTranslator = (key: string) => `${key}_translated`;

    const expectedResult = {
      WELCOME: "WELCOME_translated",
      Header: {
        SIGN_UP: "Header.SIGN_UP_translated",
        LOG_IN: "Header.LOG_IN_translated",
      },
    };

    const result = getTranslationsObjectFromDefaultTranslations(
      defaultTranslations,
      namespace,
      dummyTranslator
    );

    expect(result).toEqual(expectedResult);
  });
});
