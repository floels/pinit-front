import React from "react";
import { useTranslations } from "next-intl";
import styles from "./AccountOptionsFlyout.module.css";

type AccountOptionsFlyoutProps = {
  handleClickLogOut: () => void;
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>(({ handleClickLogOut }, ref) => {
  const t = useTranslations("HomePageAuthenticated");

  return (
    <div ref={ref} className={styles.container}>
      <div>
        <div className={styles.sectionHeader}>
          {t("ACCOUNT_OPTIONS_MORE_OPTIONS")}
        </div>
        <div onClick={handleClickLogOut} className={styles.sectionItem}>
          {t("LOG_OUT")}
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
