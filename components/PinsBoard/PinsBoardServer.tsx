import { useTranslations } from "next-intl";
import PinsBoardClient from "./PinsBoardClient";
import { getTranslationsObject } from "@/lib/utils/i18n";
import { PinThumbnailType } from "./PinThumbnail";

type PinsBoardServerProps = {
  initialPinThumbnails: PinThumbnailType[];
  errorCode?: string;
};

const PinsBoardServer = ({
  initialPinThumbnails,
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
    component: homePageTranslations.Content,
    commons: commonsTranslations,
  };

  return (
    <PinsBoardClient
      initialPinThumbnails={initialPinThumbnails}
      labels={labels}
      errorCode={errorCode}
    />
  );
};

export default PinsBoardServer;
