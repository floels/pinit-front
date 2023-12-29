import React from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faWarning } from "@fortawesome/free-solid-svg-icons";
import styles from "./AccountOptionsFlyout.module.css";
import { AccountType } from "@/lib/types";
import { useActiveAccountContext } from "@/contexts/ActiveAccountContext";
import AccountDisplay from "./AccountDisplay";

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

  const { activeAccountUsername, setActiveAccountUsername } =
    useActiveAccountContext();

  const getAccountsWithActiveAccountInFirstPosition = (
    accounts: AccountType[],
  ) => {
    if (!accounts.length) {
      // 'accounts' array is empty => nothing to do
      return accounts;
    }

    const activeAccount = accounts.find(
      (account) => account.username === activeAccountUsername,
    );

    if (!activeAccount) {
      // Active account not found: by default, consider first account to be active
      setActiveAccountUsername(accounts[0].username);

      return accounts;
    }

    const inactiveAccounts = accounts.filter(
      (account) => account.username !== activeAccountUsername,
    );

    return [activeAccount, ...inactiveAccounts];
  };

  const accountsWithActiveAccountInFirstPosition =
    getAccountsWithActiveAccountInFirstPosition(ownedAccounts);

  const hasAtLeastOneOwnedAccount = ownedAccounts?.length > 0;

  const hasMoreThanOneAccount = ownedAccounts?.length > 1;

  let accountsDisplay;

  if (hasMoreThanOneAccount) {
    accountsDisplay = (
      <div>
        <div>
          <div className={styles.sectionHeader}>{t("CURRENTLY_IN")}</div>
          <AccountDisplay
            account={accountsWithActiveAccountInFirstPosition[0]}
            isActive
            onClick={() => {
              setActiveAccountUsername(
                accountsWithActiveAccountInFirstPosition[0].username,
              );
            }}
          />
        </div>
        <div className={styles.otherAccountsContainer}>
          <div className={styles.sectionHeader}>{t("YOUR_OTHER_ACCOUNTS")}</div>
          <div>
            {accountsWithActiveAccountInFirstPosition.map((account, index) => {
              if (index > 0) {
                return (
                  <AccountDisplay
                    account={account}
                    key={`account-${account.username}`}
                    onClick={() => setActiveAccountUsername(account.username)}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  } else if (hasAtLeastOneOwnedAccount) {
    // If the user has only one account, no need to display a tick to show the active account
    // That's why we render <AccountDisplay /> without 'isActive':
    accountsDisplay = (
      <div>
        <div className={styles.sectionHeader}>{t("CURRENTLY_IN")}</div>
        <AccountDisplay
          account={ownedAccounts[0]}
          onClick={() => setActiveAccountUsername(ownedAccounts[0].username)}
        />
      </div>
    );
  }

  const spinnerDisplay = (
    <div
      className={styles.spinnerContainer}
      data-testid="owned-accounts-spinner"
    >
      <FontAwesomeIcon icon={faSpinner} size="xl" spin />
    </div>
  );

  const shouldDisplayError =
    !isFetching && (fetchFailed || !hasAtLeastOneOwnedAccount);

  const errorDisplay = (
    <div className={styles.errorContainer}>
      <FontAwesomeIcon icon={faWarning} className={styles.errorIcon} />
      {t("ERROR_RETRIEVING_ACCOUNTS")}
    </div>
  );

  return (
    <div
      ref={ref}
      className={styles.container}
      data-testid="account-options-flyout"
    >
      {accountsDisplay}
      {isFetching && spinnerDisplay}
      {shouldDisplayError && errorDisplay}
      <div className={styles.moreOptionsContainer}>
        <div className={styles.sectionHeader}>{t("MORE_OPTIONS")}</div>
        <div onClick={handleClickLogOut} className={styles.logoutButton}>
          {t("LOG_OUT")}
        </div>
      </div>
    </div>
  );
});

AccountOptionsFlyout.displayName = "AccountOptionsFlyout";

export default AccountOptionsFlyout;
