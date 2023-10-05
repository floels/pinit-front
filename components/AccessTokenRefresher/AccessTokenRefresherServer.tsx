import { useTranslations } from "next-intl";
import { getTranslationsObject } from "@/lib/utils/i18n";
import AccessTokenRefresherClient from "./AccessTokenRefresherClient";

const AccessTokenRefresherServer = () => {
  const landingPageTranslator = useTranslations("LandingPage");
  const landingPageTranslations = getTranslationsObject(
    "LandingPage",
    landingPageTranslator,
  ) as { Header: { [key: string]: any }; Content: { [key: string]: any } };

  const commonsTranslator = useTranslations("Common");
  const commonsTranslations = getTranslationsObject(
    "Common",
    commonsTranslator,
  );

  const labels = {
    commons: commonsTranslations,
    component: {
      ...landingPageTranslations.Content,
      LoginForm: landingPageTranslations.Header.LoginForm,
      SignupForm: landingPageTranslations.Header.LoginForm,
    },
  };

  return <AccessTokenRefresherClient labels={labels} />;
};

export default AccessTokenRefresherServer;
