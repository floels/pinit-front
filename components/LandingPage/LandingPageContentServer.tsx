import { useTranslations } from "next-intl";
import LandingPageContentClient from "./LandingPageContentClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

export type LandingPageContentServerProps = {
  errorCode?: string;
};

const LandingPageContentServer = ({
  errorCode,
}: LandingPageContentServerProps) => {
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

  return <LandingPageContentClient errorCode={errorCode} labels={labels} />;
};

export default LandingPageContentServer;
