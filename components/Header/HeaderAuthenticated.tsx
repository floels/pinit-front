import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AccountOptionsFlyout, { UserInformation } from "./AccountOptionsFlyout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeaderAuthenticated.module.css";

type HeaderAuthenticatedProps = {
  userInformation: UserInformation;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const HeaderAuthenticated = ({
  userInformation,
  setIsAuthenticated,
}: HeaderAuthenticatedProps) => {
  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);
  const accountOptionsButtonRef = useRef<HTMLDivElement>(null);

  const [isAccountOptionsFlyoutOpen, setAccountOptionsFlyoutOpen] =
    useState(false);

  const handleClickAccountOptionsButton = (event: any) => {
    setAccountOptionsFlyoutOpen(!isAccountOptionsFlyoutOpen);
  };

  const handleClickDocument = (event: MouseEvent) => {
    const target = event.target as Node;

    if (
      accountOptionsFlyoutRef.current &&
      !accountOptionsFlyoutRef.current.contains(target) &&
      accountOptionsButtonRef.current &&
      !accountOptionsButtonRef.current.contains(target)
      // NB: we don't do anything if the user clicks on the account options button
      // as this click is managed by the `handleClickAccountOptionsButton` function above
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
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/images/logo.svg"
            alt="PinIt logo"
            width={24}
            height={24}
          />
        </Link>
        <div className={styles.searchBarContainer}></div>
        <button
          className={styles.accountOptionsButton}
          onClick={handleClickAccountOptionsButton}
        >
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
      </div>
      {isAccountOptionsFlyoutOpen && (
        <AccountOptionsFlyout
          ref={accountOptionsFlyoutRef}
          userInformation={userInformation}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
    </div>
  );
};

export default HeaderAuthenticated;
