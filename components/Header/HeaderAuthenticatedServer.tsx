import { useTranslations } from "next-intl";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";
import { getTranslationsObject } from "@/lib/utils/i18n";
import { AccountType } from "./Header";

export type HeaderAuthenticatedServerProps = {
  accounts?: AccountType[];
};

const HeaderAuthenticatedServer = ({
  accounts,
}: HeaderAuthenticatedServerProps) => {
  const translator = useTranslations("HomePageAuthenticated");
  const translations = getTranslationsObject(
    "HomePageAuthenticated",
    translator
  ) as any;

  return (
    <HeaderAuthenticatedClient
      accounts={accounts}
      labels={translations.Header}
    />
  );
};

export default HeaderAuthenticatedServer;
