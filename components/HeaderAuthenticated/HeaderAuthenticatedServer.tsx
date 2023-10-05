import { useTranslations } from "next-intl";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

const HeaderAuthenticatedServer = () => {
  const homePageTranslator = useTranslations("HomePage");
  const homePageTranslations = getTranslationsObject(
    "HomePage",
    homePageTranslator,
  ) as {
    Header: { [key: string]: string };
  };

  return <HeaderAuthenticatedClient labels={homePageTranslations.Header} />;
};

export default HeaderAuthenticatedServer;
