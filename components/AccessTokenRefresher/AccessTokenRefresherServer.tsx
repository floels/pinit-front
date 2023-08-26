import { useTranslations } from "next-intl";
import { getTranslationsObject } from "@/lib/utils/i18n";
import AccessTokenRefresherClient from "./AccessTokenRefresherClient";

const AccessTokenRefresherServer = () => {
  const componentTranslator = useTranslations("HomePageUnauthenticated");
  const componentTranslations = getTranslationsObject(
    "HomePageUnauthenticated",
    componentTranslator
  );

  const commonsTranslator = useTranslations("Common");
  const commonsTranslations = getTranslationsObject(
    "Common",
    commonsTranslator
  );

  return (
    <AccessTokenRefresherClient
      labels={{
        component: componentTranslations,
        commons: commonsTranslations,
      }}
    />
  );
};

export default AccessTokenRefresherServer;
