import { useTranslations } from "next-intl";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";

export type UserDetails = {
  email: string;
  initial: string;
  firstName: string;
  lastName: string;
};

type HeaderAuthenticatedServerProps = {
  userDetails?: UserDetails;
  errorCode?: string;
};

const HeaderAuthenticatedServer = ({
  userDetails,
  errorCode,
}: HeaderAuthenticatedServerProps) => {
  const translator = useTranslations("HomePageAuthenticated");
  const translations = getTranslationsObject(
    "HomePageAuthenticated",
    translator
  ) as any;

  return (
    <HeaderAuthenticatedClient
      userDetails={userDetails}
      errorCode={errorCode}
      labels={translations.Header}
    />
  );
};

export default HeaderAuthenticatedServer;
