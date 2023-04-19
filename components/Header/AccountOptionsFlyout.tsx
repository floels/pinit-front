import React from "react";
import Cookies from "js-cookie";
import { useIntl } from "react-intl";
import styles from "./AccountOptionsFlyout.module.css";

type AccountOptionsFlyoutProps = {
  handleClickLogOut: () => void;
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>(({ handleClickLogOut }, ref) => {
  const intl = useIntl();

  return (
    <div ref={ref} className={styles.container}>
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
