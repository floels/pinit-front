import { useTranslations } from "next-intl";
import HomePageUnauthenticatedClient from "./HomePageUnauthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

const HomePageUnauthenticatedServer = () => {
  const translator = useTranslations("HomePageUnauthenticated");
  const componentTranslations = getTranslationsObject(
    "HomePageUnauthenticated",
    translator
  );
  const commonsTranslations = getTranslationsObject(
    "Common",
    translator
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
