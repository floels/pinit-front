import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import styles from "./AccountOptionsFlyout.module.css";

export type UserInformation = {
  username: string;
  firstName: string;
  lastName: string;
};

type AccountOptionsFlyoutProps = {
  userInformation: UserInformation;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>(({ userInformation, setIsAuthenticated }, ref) => {
  const intl = useIntl();

  const handleClickLogOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsAuthenticated(false);
  };

  return (
    <div ref={ref} className={styles.accountOptionsFlyout}>
      <div>
        <div className={styles.sectionHeader}>
          {intl.formatMessage({ id: "CURRENTLY_IN" })}
        </div>
      </div>
      <div>
        <div className={styles.sectionHeader}>
          {intl.formatMessage({ id: "ACCOUNT_OPTIONS_MORE_OPTIONS" })}
        </div>
        <div onClick={handleClickLogOut} className={styles.sectionItem}>
          {intl.formatMessage({ id: "LOG_OUT" })}
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
