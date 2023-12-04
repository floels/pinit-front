import React from "react";
import styles from "./AccountOptionsFlyout.module.css";
import { useTranslations } from "next-intl";

type AccountOptionsFlyoutProps = {
  handleClickLogOut: () => void;
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>(({ handleClickLogOut }, ref) => {
  const t = useTranslations("HeaderAuthenticated");

  return (
    <div ref={ref} className={styles.container}>
      <div>
        <div className={styles.sectionHeader}>{t("MORE_OPTIONS")}</div>
        <div onClick={handleClickLogOut} className={styles.sectionItem}>
          {t("LOG_OUT")}
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
