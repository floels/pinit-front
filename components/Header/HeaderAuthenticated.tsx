import { useState, useRef, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { useIntl } from "react-intl";
import Image from "next/image";
import Link from "next/link";
import GlobalStateContext from "../../app/globalState";
import AccountOptionsFlyout from "./AccountOptionsFlyout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeaderAuthenticated.module.css";

const HeaderAuthenticated = () => {
  const intl = useIntl();

  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);
  const accountOptionsButtonRef = useRef<HTMLDivElement>(null);

  const { dispatch } = useContext(GlobalStateContext);

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

  const handleClickLogOut = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    dispatch({ type: "SET_IS_AUTHENTICATED", payload: false });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickDocument);

    return () => {
      document.removeEventListener("mousedown", handleClickDocument);
    };
  });

  return (
    <nav className={styles.container}>
      <div className={styles.headerItemsContainer}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/images/logo.svg"
            alt="PinIt logo"
            width={24}
            height={24}
          />
        </Link>
        <Link href="/" className={styles.navigationItem}>
          {intl.formatMessage({ id: "NAV_ITEM_HOME" })}
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
          handleClickLogOut={handleClickLogOut}
        />
      )}
    </nav>
  );
};

export default HeaderAuthenticated;
