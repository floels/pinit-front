import React, { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./AccountOptionsFlyout.module.css";
import LogoutTrigger from "../LogoutTrigger/LogoutTrigger";

const AccountOptionsFlyout = React.forwardRef<HTMLDivElement>((_, ref) => {
  const t = useTranslations("HeaderAuthenticated");

  const [clickedLogOut, setClickedLogOut] = useState(false);

  const handleClickLogOut = () => {
    setClickedLogOut(true);
  };

  if (clickedLogOut) {
    return <LogoutTrigger />;
  }

  return (
    <div
      ref={ref}
      className={styles.container}
      data-testid="account-options-flyout"
    >
      <div className={styles.moreOptionsContainer}>
        <div className={styles.moreOptionsLabel}>{t("MORE_OPTIONS")}</div>
        <div
          onClick={handleClickLogOut}
          className={styles.logoutButton}
          data-testid="account-options-flyout-log-out-button"
        >
          {t("LOG_OUT")}
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
