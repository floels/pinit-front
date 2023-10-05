import { useTranslations } from "next-intl";
import HomePageContentClient from "./HomePageContentClient";
import { getTranslationsObject } from "@/lib/utils/i18n";
import { PinSuggestionType } from "./PinSuggestion";

type HomePageContentServer = {
  initialPinSuggestions: PinSuggestionType[];
  errorCode?: string;
};

const HomePageContentServer = ({
  initialPinSuggestions,
  errorCode,
}: HomePageContentServer) => {
  const homePageTranslator = useTranslations("HomePage");
  const homePageTranslations = getTranslationsObject(
    "HomePage",
    homePageTranslator,
  ) as { Content: { [key: string]: any } };

  const commonsTranslator = useTranslations("Common");
  const commonsTranslations = getTranslationsObject(
    "Common",
    commonsTranslator,
  );

  const labels = {
    component: homePageTranslations.Content,
    commons: commonsTranslations,
  };

  return (
    <HomePageContentClient
      initialPinSuggestions={initialPinSuggestions}
      labels={labels}
      errorCode={errorCode}
    />
  );
};

export default HomePageContentServer;
