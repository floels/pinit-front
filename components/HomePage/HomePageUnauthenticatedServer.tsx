import { useTranslations } from "next-intl";
import HomePageUnauthenticated from "./HomePageUnauthenticatedClient";

const HomePageUnauthenticatedServer = () => {
  const t = useTranslations("HomePageUnauthenticated");

  const labels = {
    LOG_IN: t("LOG_IN"),
    SIGN_UP: t("SIGN_UP"),
    EASY_CHICKEN_DINNER: t("EASY_CHICKEN_DINNER"),
    SEARCH_FOR_AN_IDEA: t("SEARCH_FOR_AN_IDEA"),
    WHAT_DO_YOU_WANT_TO_TRY_NEXT: t("WHAT_DO_YOU_WANT_TO_TRY_NEXT"),
    EXPLORE: t("EXPLORE"),
    WELCOME_TO_PINIT: t("WELCOME_TO_PINIT"),
    EMAIL: t("EMAIL"),
    PASSWORD: t("PASSWORD"),
    INVALID_EMAIL_INPUT: t("INVALID_EMAIL_INPUT"),
    INVALID_EMAIL_LOGIN: t("INVALID_EMAIL_LOGIN"),
    INVALID_PASSWORD_INPUT: t("INVALID_PASSWORD_INPUT"),
    INVALID_PASSWORD_LOGIN: t("INVALID_PASSWORD_LOGIN"),
    CONNECTION_ERROR: useTranslations("Common")("CONNECTION_ERROR"),
    UNFORESEEN_ERROR: useTranslations("Common")("UNFORESEEN_ERROR"),
    NO_ACCOUNT_YET: t("NO_ACCOUNT_YET"),
    SIGNUP: t("SIGN_UP"),
    FIND_NEW_IDEAS: t("FIND_NEW_IDEAS"),
    BIRTHDATE: t("BIRTHDATE"),
    INVALID_EMAIL_SIGNUP: t("INVALID_EMAIL_SIGNUP"),
    INVALID_PASSWORD_SIGNUP: t("INVALID_PASSWORD_SIGNUP"),
    INVALID_BIRTHDATE_SIGNUP: t("INVALID_BIRTHDATE_SIGNUP"),
    EMAIL_ALREADY_SIGNED_UP: t("EMAIL_ALREADY_SIGNED_UP"),
    CONTINUE: t("CONTINUE"),
    ALREADY_HAVE_ACCOUNT: t("ALREADY_HAVE_ACCOUNT"),
    GET_YOUR_NEXT: t("GET_YOUR_NEXT"),
    HOW_IT_WORKS: t("HOW_IT_WORKS"),
    HEADER_FOOD: t("HEADER_FOOD"),
    HEADER_HOME: t("HEADER_HOME"),
    HEADER_OUTFIT: t("HEADER_OUTFIT"),
    HEADER_GARDENING: t("HEADER_GARDENING"),
  };

  return <HomePageUnauthenticated labels={labels} />;
};

export default HomePageUnauthenticatedServer;
