import { useTranslations } from "next-intl";
import HomePageUnauthenticatedClient from "./HomePageUnauthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

export type HomePageUnauthenticatedServerProps = {
  errorCode?: string;
};

const HomePageUnauthenticatedServer = ({ errorCode }: HomePageUnauthenticatedServerProps) => {
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
      errorCode={errorCode}
      labels={{
        component: componentTranslations,
        commons: commonsTranslations,
      }}
    />
  );
};

export default HomePageUnauthenticatedServer;
