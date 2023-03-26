import { useState, useRef, useEffect } from "react";
import AccountOptionsFlyout, { UserInformation } from "./AccountOptionsFlyout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeaderAuthenticated.module.css";

type HeaderAuthenticatedProps = {
  userInformation: UserInformation;
};

const HeaderAuthenticated = ({ userInformation }: HeaderAuthenticatedProps) => {
  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);

  const [isAccountOptionsFlyoutOpen, setAccountOptionsFlyoutOpen] =
    useState(false);

  const handleClickAccountOptionsButton = () => {
    setAccountOptionsFlyoutOpen(true);
  };

  const handleClickDocument = (event: MouseEvent) => {
    if (
      accountOptionsFlyoutRef.current &&
      !accountOptionsFlyoutRef.current.contains(event.target as Node)
    ) {
      setAccountOptionsFlyoutOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickDocument);

    return () => {
      document.removeEventListener("mousedown", handleClickDocument);
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerItemsContainer}>
        <div className={styles.searchBarContainer}></div>
        <div className={styles.accountOptionsButtonContainer}>
          <button
            className={styles.accountOptionsButton}
            onClick={handleClickAccountOptionsButton}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
        </div>
      </div>
      {isAccountOptionsFlyoutOpen && (
        <AccountOptionsFlyout
          ref={accountOptionsFlyoutRef}
          userInformation={userInformation}
        />
      )}
    </div>
  );
};

export default HeaderAuthenticated;
