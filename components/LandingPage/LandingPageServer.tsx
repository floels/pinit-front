import { useTranslations } from "next-intl";
import LandingPageClient from "./LandingPageClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

export type LandingPageServerProps = {
  errorCode?: string;
};

const LandingPageServer = ({ errorCode }: LandingPageServerProps) => {
  const landingPageTranslator = useTranslations("LandingPage");
  const landingPageTranslations = getTranslationsObject(
    "LandingPage",
    landingPageTranslator,
  );

  const commonsTranslator = useTranslations("Common");
  const commonsTranslations = getTranslationsObject(
    "Common",
    commonsTranslator,
  );

  const labels = {
    commons: commonsTranslations,
    component: landingPageTranslations,
  };

  return <LandingPageClient errorCode={errorCode} labels={labels} />;
};

export default LandingPageServer;
