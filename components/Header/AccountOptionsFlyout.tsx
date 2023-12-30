import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faWarning } from "@fortawesome/free-solid-svg-icons";
import styles from "./AccountOptionsFlyout.module.css";
import { AccountType } from "@/lib/types";
import { useAccountsContext } from "@/contexts/AccountsContext";
import AccountDisplay from "./AccountDisplay";
import Cookies from "js-cookie";
import { ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY } from "@/lib/constants";
import LogoutTrigger from "../LogoutTrigger/LogoutTrigger";

const AccountOptionsFlyout = React.forwardRef<HTMLDivElement>((_, ref) => {
  const t = useTranslations("HeaderAuthenticated");

  const [clickedLogOut, setClickedLogOut] = useState(false);

  const handleClickLogOut = () => {
    setClickedLogOut(true);
  };

  const accountsContext = useAccountsContext();

  const {
    isFetchingAccounts,
    isErrorFetchingAccounts,
    activeAccountUsername,
    setActiveAccountUsername,
  } = accountsContext;

  const accounts = accountsContext.accounts || [];

  if (clickedLogOut) {
    return <LogoutTrigger />;
  }

  const handleChangeActiveAccount = (newActiveAccountUsername: string) => {
    setActiveAccountUsername(newActiveAccountUsername);

    Cookies.set(ACTIVE_ACCOUNT_USERNAME_COOKIE_KEY, newActiveAccountUsername);
  };

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
      // Active account not found => nothing to do
      return accounts;
    }

    const inactiveAccounts = accounts.filter(
      (account) => account.username !== activeAccountUsername,
    );

    return [activeAccount, ...inactiveAccounts];
  };

  const accountsWithActiveAccountInFirstPosition =
    getAccountsWithActiveAccountInFirstPosition(accounts);

  const hasAtLeastOneOwnedAccount = accounts?.length > 0;

  const hasMoreThanOneAccount = accounts?.length > 1;

  let accountsDisplay;

  if (hasMoreThanOneAccount) {
    accountsDisplay = (
      <div>
        <div data-testid="currently-in-section">
          <div className={styles.sectionHeader}>{t("CURRENTLY_IN")}</div>
          <AccountDisplay
            account={accountsWithActiveAccountInFirstPosition[0]}
            isActive
            onClick={() => {
              handleChangeActiveAccount(
                accountsWithActiveAccountInFirstPosition[0].username,
              );
            }}
          />
        </div>
        <div
          className={styles.otherAccountsContainer}
          data-testid="other-accounts-section"
        >
          <div className={styles.sectionHeader}>{t("YOUR_OTHER_ACCOUNTS")}</div>
          <div>
            {accountsWithActiveAccountInFirstPosition.map((account, index) => {
              if (index > 0) {
                return (
                  <AccountDisplay
                    account={account}
                    key={`account-${account.username}`}
                    onClick={() => handleChangeActiveAccount(account.username)}
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
          account={accounts[0]}
          onClick={() => handleChangeActiveAccount(accounts[0].username)}
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
    !isFetchingAccounts &&
    (isErrorFetchingAccounts || !hasAtLeastOneOwnedAccount);

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
      {isFetchingAccounts && spinnerDisplay}
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
