import { useTranslations } from "next-intl";
import HomePageUnauthenticatedClient from "./HomePageUnauthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

export type HomePageUnauthenticatedServerProps = {
  errorCode?: string;
};

const HomePageUnauthenticatedServer = ({ errorCode }: HomePageUnauthenticatedServerProps) => {
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
