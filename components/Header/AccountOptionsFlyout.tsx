import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import styles from "./AccountOptionsFlyout.module.css";

export type UserInformation = {
  username: string;
  userFirstName: string;
  userLastName: string;
};

type AccountOptionsFlyoutProps = {
  userInformation: UserInformation;
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>((props, ref) => {
  const router = useRouter();

  const handleClickLogOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    router.push("/");
  };

  return (
    <div ref={ref} className={styles.accountOptionsFlyout}>
      <div>
        <div className={styles.sectionHeader}>
          <FormattedMessage id="CURRENTLY_IN" />
        </div>
      </div>
      <div>
        <div className={styles.sectionHeader}>
          <FormattedMessage id="ACCOUNT_OPTIONS_MORE_OPTIONS" />
        </div>
        <div onClick={handleClickLogOut} className={styles.sectionItem}>
          <FormattedMessage id="LOG_OUT" />
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
