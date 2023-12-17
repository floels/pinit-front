import React from "react";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCheck,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AccountOptionsFlyout.module.css";
import { AccountType, TypesOfAccount } from "@/lib/types";
import Image from "next/image";

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

  const hasAtLeastOneOwnedAccount = ownedAccounts?.length > 0;

  const shouldDisplayError =
    !isFetching && (fetchFailed || !hasAtLeastOneOwnedAccount);

  const hasMoreThanOneAccount = ownedAccounts?.length > 1;

  let accountsDisplay;

  const AccountDisplay = ({
    account,
    isActive,
    key,
  }: {
    account: AccountType;
    isActive?: boolean;
    key?: string;
  }) => {
    const commonTranslations = useTranslations("Common");

    const accountTypeDisplay =
      account.type === TypesOfAccount.PERSONAL
        ? commonTranslations("ACCOUNT_TYPE_PERSONAL")
        : commonTranslations("ACCOUNT_TYPE_BUSINESS");

    return (
      <div key={key} className={styles.accountDisplayContainer}>
        <div>
          {account.profilePictureURL ? (
            <Image
              src={account.profilePictureURL}
              width={60}
              height={60}
              alt={`${t("ALT_PROFILE_PICTURE_OF")} ${account.displayName}`}
              className={styles.profilePicture}
            />
          ) : (
            <div className={styles.accountInitial}>{account.initial}</div>
          )}
        </div>
        <div className={styles.accountInfo}>
          <div className={styles.accountDisplayName}>{account.displayName}</div>
          <div className={styles.accountType}>{accountTypeDisplay}</div>
        </div>
        {isActive && <FontAwesomeIcon icon={faCheck} />}
      </div>
    );
  };

  if (hasMoreThanOneAccount) {
    accountsDisplay = (
      <div>
        <div>
          <div className={styles.sectionHeader}>{t("CURRENTLY_IN")}</div>
          <AccountDisplay account={ownedAccounts[0]} isActive />
        </div>
        <div className={styles.otherAccountsContainer}>
          <div className={styles.sectionHeader}>{t("YOUR_OTHER_ACCOUNTS")}</div>
          <div>
            {ownedAccounts.map((account, index) => {
              if (index > 0) {
                return (
                  <AccountDisplay
                    account={account}
                    key={`account-${account.username}`}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  } else if (hasAtLeastOneOwnedAccount) {
    accountsDisplay = (
      <div>
        <div className={styles.sectionHeader}>{t("CURRENTLY_IN")}</div>
        <AccountDisplay account={ownedAccounts[0]} />
      </div>
    );
  }

  const spinnerDisplay = (
    <div className={styles.spinnerContainer} data-testid="spinner">
      <FontAwesomeIcon icon={faSpinner} size="xl" spin />
    </div>
  );

  const errorDisplay = (
    <div className={styles.errorContainer}>
      <FontAwesomeIcon icon={faWarning} className={styles.errorIcon} />
      {t("ERROR_RETRIEVING_ACCOUNTS")}
    </div>
  );

  return (
    <div ref={ref} className={styles.container}>
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
