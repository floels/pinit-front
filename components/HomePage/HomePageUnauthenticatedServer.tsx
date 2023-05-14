import { useTranslations } from "next-intl";
import HomePageUnauthenticated from "./HomePageUnauthenticatedClient";

const HomePageUnauthenticatedServer = () => {
  const componentTranslator = useTranslations("HomePageUnauthenticated");
  const commonsTranslator = useTranslations("Commons");

  return <HomePageUnauthenticated labels={labels} />;
};

export default HomePageUnauthenticatedServer;
