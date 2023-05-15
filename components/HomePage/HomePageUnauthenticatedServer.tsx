import { useTranslations } from "next-intl";
import HomePageUnauthenticatedClient from "./HomePageUnauthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

const HomePageUnauthenticatedServer = () => {
  const componentTranslator = useTranslations("HomePageUnauthenticated");
  const componentTranslations = getTranslationsObject(
    "HomePageUnauthenticated",
    componentTranslator
  );

  const commonsTranslator = useTranslations("Commons");
  const commonsTranslations = getTranslationsObject(
    "Commons",
    commonsTranslator
  );

  return (
    <HomePageUnauthenticatedClient
      labels={{
        component: componentTranslations,
        commons: commonsTranslations,
      }}
    />
  );
};

export default HomePageUnauthenticatedServer;
