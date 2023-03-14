import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import styles from "./AccountOptionsFlyout.module.css";

export type UserInfo = {
  username: string;
  userFirstName: string;
  userLastName: string;
};

type AccountOptionsFlyoutProps = UserInfo;

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>((props, ref) => {
  const router = useRouter();

  const handleClickLogOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    router.push("/login");
  };

  return (
    <div ref={ref} className={styles.accountOptionsFlyout}>
      <div>
        <div className={styles.sectionHeader}>
          <FormattedMessage id="currentlyIn" defaultMessage="Currently in" />
        </div>
      </div>
      <div>
        <div className={styles.sectionHeader}>
          <FormattedMessage
            id="accountOptionsMoreOptions"
            defaultMessage="More options"
          />
        </div>
        <div onClick={handleClickLogOut} className={styles.sectionItem}>
          <FormattedMessage id="logOut" defaultMessage="Log out" />
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
