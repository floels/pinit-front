import { useTranslations } from "next-intl";
import PinsBoardClient from "./PinsBoardClient";
import { getTranslationsObject } from "@/lib/utils/i18n";
import { PinType } from "@/lib/types";

type PinsBoardServerProps = {
  initialPins: PinType[];
  fetchPinsAPIRoute: string;
  errorCode?: string;
};

const PinsBoardServer = ({
  initialPins,
  fetchPinsAPIRoute,
  errorCode,
}: PinsBoardServerProps) => {
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
    component: homePageTranslations.Content.PinsBoard,
    commons: commonsTranslations,
  };

  return (
    <PinsBoardClient
      initialPins={initialPins}
      fetchPinsAPIRoute={fetchPinsAPIRoute}
      labels={labels}
      errorCode={errorCode}
    />
  );
};

export default PinsBoardServer;
