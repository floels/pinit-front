import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { AccountType, TypesOfAccount } from "@/lib/types";
import { useTranslations } from "next-intl";
import styles from "./AccountDisplay.module.css";

type AccountDisplayProps = {
  account: AccountType;
  isActive?: boolean;
  onClick: () => void;
};

const AccountDisplay = ({
  account,
  isActive,
  onClick,
}: AccountDisplayProps) => {
  const t = useTranslations("HeaderAuthenticated");
  const commonTranslations = useTranslations("Common");

  const accountTypeDisplay =
    account.type === TypesOfAccount.PERSONAL
      ? commonTranslations("ACCOUNT_TYPE_PERSONAL")
      : commonTranslations("ACCOUNT_TYPE_BUSINESS");

  return (
    <div className={styles.container} onClick={onClick}>
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
      {isActive && (
        <FontAwesomeIcon
          icon={faCheck}
          className={styles.isActiveIcon}
          data-testid="icon-active-account"
        />
      )}
    </div>
  );
};

export default AccountDisplay;
