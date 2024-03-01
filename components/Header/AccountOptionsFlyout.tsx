import React from "react";
import { useTranslations } from "next-intl";
import styles from "./AccountOptionsFlyout.module.css";

type AccountOptionsFlyoutProps = {
  handleClickLogOut: () => void;
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>((props, ref) => {
  const { handleClickLogOut } = props;

  const t = useTranslations("HeaderAuthenticated");

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
