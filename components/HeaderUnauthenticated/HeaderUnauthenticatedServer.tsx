import { useTranslations } from "next-intl";
import HeaderUnauthenticatedClient from "./HeaderUnauthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

const HeaderUnauthenticatedServer = () => {
  const landingPageTranslator = useTranslations("LandingPage");
  const landingPageTranslations = getTranslationsObject(
    "LandingPage",
    landingPageTranslator,
  ) as {
    Header: { [key: string]: string };
    Content: {
      LoginForm: { [key: string]: string };
      SignupForm: { [key: string]: string };
    };
  };

  const commonsTranslator = useTranslations("Common");
  const commonsTranslations = getTranslationsObject(
    "Common",
    commonsTranslator,
  );

  const labels = {
    commons: commonsTranslations,
    component: {
      ...landingPageTranslations.Header,
      LoginForm: landingPageTranslations.Header.LoginForm,
      SignupForm: landingPageTranslations.Header.SignupForm,
    },
  };

  return <HeaderUnauthenticatedClient labels={labels} />;
};

export default HeaderUnauthenticatedServer;
