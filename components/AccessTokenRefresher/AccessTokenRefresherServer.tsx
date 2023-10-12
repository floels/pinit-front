import { useTranslations } from "next-intl";
import { getTranslationsObject } from "@/lib/utils/i18n";
import AccessTokenRefresherClient from "./AccessTokenRefresherClient";
import SignupForm from "../SignupForm/SignupForm";

const AccessTokenRefresherServer = () => {
  const landingPageTranslator = useTranslations("LandingPage");
  const landingPageTranslations = getTranslationsObject(
    "LandingPage",
    landingPageTranslator,
  ) as {
    LoginForm: { [key: string]: string };
    SignupForm: { [key: string]: string };
    Content: { [key: string]: any };
  };

  const commonsTranslator = useTranslations("Common");
  const commonsTranslations = getTranslationsObject(
    "Common",
    commonsTranslator,
  );

  const labels = {
    commons: commonsTranslations,
    component: {
      ...landingPageTranslations.Content,
      LoginForm: landingPageTranslations.LoginForm,
      SignupForm: landingPageTranslations.LoginForm,
    },
  };

  return <AccessTokenRefresherClient labels={labels} />;
};

export default AccessTokenRefresherServer;
