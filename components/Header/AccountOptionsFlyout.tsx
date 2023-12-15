import React from "react";
import { useTranslations } from "next-intl";
import styles from "./AccountOptionsFlyout.module.css";
import { AccountType } from "@/lib/types";

type AccountOptionsFlyoutProps = {
  isFetching: boolean;
  fetchFailed: boolean;
  ownedAccounts: AccountType[];
  handleClickLogOut: () => void;
};

const AccountOptionsFlyout = React.forwardRef<
  HTMLDivElement,
  AccountOptionsFlyoutProps
>(({ isFetching, fetchFailed, ownedAccounts, handleClickLogOut }, ref) => {
  const t = useTranslations("HeaderAuthenticated");

  const hasAtLeastOneAccount = ownedAccounts?.length > 0;

  const hasMoreThanOneAccount = ownedAccounts?.length > 1;

  return (
    <div ref={ref} className={styles.container}>
      <div className={styles.sectionHeader}>{t("CURRENTLY_IN")}</div>
      {hasAtLeastOneAccount && <div>{ownedAccounts[0].username}</div>}
      {hasMoreThanOneAccount && (
        <div>
          <div className={styles.sectionHeader}>{t("YOUR_OTHER_ACCOUNTS")}</div>
          <div>
            {ownedAccounts.map((account, index) => {
              if (index > 0) {
                return (
                  <div key={`account-${account.username}`}>
                    {account.username}
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
      <div className={styles.sectionHeader}>{t("MORE_OPTIONS")}</div>
      <div onClick={handleClickLogOut} className={styles.sectionItem}>
        {t("LOG_OUT")}
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
