import { useTranslations } from "next-intl";
import HeaderAuthenticatedClient from "./HeaderAuthenticatedClient";

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
  const t = useTranslations("HomePageAuthenticated");

  const labels = {
    NAV_ITEM_HOME: t("NAV_ITEM_HOME"),
    CREATE: t("CREATE"),
    CREATE_PIN: t("CREATE_PIN"),
    PLACEHOLDER_SEARCH: t("PLACEHOLDER_SEARCH"),
    YOUR_PROFILE: t("YOUR_PROFILE"),
    ACCOUNT_OPTIONS: t("ACCOUNT_OPTIONS"),
    ACCOUNT_OPTIONS_MORE_OPTIONS: t("ACCOUNT_OPTIONS_MORE_OPTIONS"),
    LOG_OUT: t("LOG_OUT"),
  };

  return (
    <HeaderAuthenticatedClient
      userDetails={userDetails}
      errorCode={errorCode}
      labels={labels}
    />
  );
};

export default HeaderAuthenticatedServer;
