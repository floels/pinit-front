import { useTranslations } from "next-intl";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";
import { AccountType } from "./Header";

export type HeaderAuthenticatedServerProps = {
  accounts?: AccountType[];
  errorCode?: string;
};

const HeaderAuthenticatedServer = ({
  accounts,
  errorCode,
}: HeaderAuthenticatedServerProps) => {
  const translator = useTranslations("HomePageAuthenticated");
  const translations = getTranslationsObject(
    "HomePageAuthenticated",
    translator
  ) as any;

  return (
    <HeaderAuthenticatedClient
      accounts={accounts}
      errorCode={errorCode}
      labels={translations.Header}
    />
  );
};

export default HeaderAuthenticatedServer;
