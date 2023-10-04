"use client";

import _ from "lodash";
import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import AccountOptionsFlyout from "./AccountOptionsFlyout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { AccountType } from "@/app/[locale]/page";
import HeaderSearchBar from "./HeaderSearchBar";
import styles from "./HeaderAuthenticatedClient.module.css";

type HeaderAuthenticatedClientProps = {
  accounts: AccountType[];
  labels: { [key: string]: any };
};

const HeaderAuthenticatedClient = ({
  accounts,
  labels,
}: HeaderAuthenticatedClientProps) => {
  const currentPathname = usePathname();

  const createFlyoutRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLDivElement>(null);

  const accountOptionsFlyoutRef = useRef<HTMLDivElement>(null);
  const accountOptionsButtonRef = useRef<HTMLDivElement>(null);

  const [isCreateFlyoutOpen, setIsCreateFlyoutOpen] = useState(false);
  const [isProfileLinkHovered, setIsProfileLinkHovered] = useState(false);
  const [isAccountOptionsButtonHovered, setIsAccountOptionsButtonHovered] =
    useState(false);
  const [isAccountOptionsFlyoutOpen, setIsAccountOptionsFlyoutOpen] =
    useState(false);

  const handleClickCreateButton = () => {
    setIsCreateFlyoutOpen(!isCreateFlyoutOpen);
  };

  const handleMouseEnterProfileLink = () => {
    setIsProfileLinkHovered(true);
  };

  const handleMouseLeaveProfileLink = () => {
    setIsProfileLinkHovered(false);
  };

  const handleMouseEnterAccountOptionsButton = () => {
    setIsAccountOptionsButtonHovered(true);
  };

  const handleMouseLeaveAccountOptionsButton = () => {
    setIsAccountOptionsButtonHovered(false);
  };

  const handleClickAccountOptionsButton = () => {
    setIsAccountOptionsFlyoutOpen(!isAccountOptionsFlyoutOpen);
  };

  const handleClickDocument = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        isCreateFlyoutOpen &&
        createFlyoutRef.current &&
        !createFlyoutRef.current.contains(target) &&
        createButtonRef.current &&
        !createButtonRef.current.contains(target)
        // NB: we don't do anything if the user clicks on the account options button
        // as this click is managed by the `handleClickCreateButton` function above
      ) {
        setIsCreateFlyoutOpen(false);
      }

      if (
        isAccountOptionsFlyoutOpen &&
        accountOptionsFlyoutRef.current &&
        !accountOptionsFlyoutRef.current.contains(target) &&
        accountOptionsButtonRef.current &&
        !accountOptionsButtonRef.current.contains(target)
      ) {
        setIsAccountOptionsFlyoutOpen(false);
      }
    },
    [isAccountOptionsFlyoutOpen, isCreateFlyoutOpen],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isCreateFlyoutOpen) {
          setIsCreateFlyoutOpen(false);
        }
        if (isAccountOptionsFlyoutOpen) {
          setIsAccountOptionsFlyoutOpen(false);
        }
      }
    },
    [isAccountOptionsFlyoutOpen, isCreateFlyoutOpen],
  );

  const handleClickLogOut = async () => {
    try {
      await fetch("/api/user/log-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      window.location.reload();
    } catch (error) {
      toast.warn(labels.commons.CONNECTION_ERROR);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickDocument);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickDocument);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClickDocument, handleKeyDown]);

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
        <Link
          href="/"
          className={`${styles.navigationItem} ${
            currentPathname === "/" ? styles.active : ""
          }`}
        >
          {labels.NAV_ITEM_HOME}
        </Link>
        <div
          className={`
            ${styles.navigationItem}
            ${styles.navigationItemCreate}
            ${currentPathname === "/pin-builder" ? styles.active : ""}
          `}
          ref={createButtonRef}
          onClick={handleClickCreateButton}
        >
          {labels.CREATE}
          <FontAwesomeIcon
            icon={faAngleDown}
            className={styles.createButtonIcon}
          />
        </div>
        {isCreateFlyoutOpen && (
          <div className={styles.createFlyout} ref={createFlyoutRef}>
            <Link href="/pin-builder" className={styles.createFlyoutItem}>
              {labels.CREATE_PIN}
            </Link>
          </div>
        )}
        <HeaderSearchBar labels={labels.SearchBar} />
        <Link
          href="/florianellis/"
          className={styles.profileLink}
          data-testid="profile-link"
          onMouseEnter={handleMouseEnterProfileLink}
          onMouseLeave={handleMouseLeaveProfileLink}
        >
          <div className={styles.profileLinkBadge}>F</div>
        </Link>
        {isProfileLinkHovered && (
          <div className={`${styles.tooltip} ${styles.profileLinkTooltip}`}>
            {labels.YOUR_PROFILE}
          </div>
        )}
        <button
          className={styles.accountOptionsButton}
          data-testid="account-options-button"
          onClick={handleClickAccountOptionsButton}
          onMouseEnter={handleMouseEnterAccountOptionsButton}
          onMouseLeave={handleMouseLeaveAccountOptionsButton}
        >
          <FontAwesomeIcon icon={faAngleDown} />
        </button>
        {isAccountOptionsButtonHovered && (
          <div
            className={`${styles.tooltip} ${styles.accountOptionsButtonTooltip}`}
          >
            {labels.ACCOUNT_OPTIONS}
          </div>
        )}
      </div>
      {isAccountOptionsFlyoutOpen && (
        <AccountOptionsFlyout
          ref={accountOptionsFlyoutRef}
          handleClickLogOut={handleClickLogOut}
          labels={labels.AccountOptionsFlyout}
        />
      )}
    </nav>
  );
};

export default HeaderAuthenticatedClient;
