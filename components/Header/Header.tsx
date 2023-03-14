import { useState, useRef, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import AccountOptionsFlyout, { UserInfo } from "./AccountOptionsFlyout";
import styles from "./Header.module.css";

type HeaderProps = UserInfo;

const Header = (props: HeaderProps) => {
  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);

  const [isAccountOptionsFlyoutOpen, setAccountOptionsFlyoutOpen] =
    useState(false);

  const handleClickAccountOptionsButton = () => {
    setAccountOptionsFlyoutOpen(true);
  };

  const handleClickOutsideAccountOptionsFlyout = (event: MouseEvent) => {
    if (
      accountOptionsFlyoutRef.current &&
      !accountOptionsFlyoutRef.current.contains(event.target as Node)
    ) {
      setAccountOptionsFlyoutOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener(
      "mousedown",
      handleClickOutsideAccountOptionsFlyout
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutsideAccountOptionsFlyout
      );
    };
  });

  return (
    <header>
      <div className={styles.headerItemsContainer}>
        <div className={styles.searchBarContainer}></div>
        <div className={styles.accountOptionsButtonContainer}>
          <button
            className={styles.accountOptionsButton}
            onClick={handleClickAccountOptionsButton}
          >
            <FaAngleDown />
          </button>
        </div>
      </div>
      {isAccountOptionsFlyoutOpen && (
        <AccountOptionsFlyout ref={accountOptionsFlyoutRef} {...props} />
      )}
    </header>
  );
};

export default Header;
