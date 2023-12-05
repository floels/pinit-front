"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AccountOptionsFlyout from "./AccountOptionsFlyout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import HeaderSearchBar from "./HeaderSearchBar";
import styles from "./HeaderAuthenticated.module.css";
import { API_ROUTE_LOG_OUT } from "@/lib/constants";

const HeaderAuthenticated = () => {
  const router = useRouter();
  const pathname = usePathname();

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

  const translatorCommon = useTranslations("Common");
  const translatorComponent = useTranslations("HeaderAuthenticated");

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
      await fetch(API_ROUTE_LOG_OUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.warn(translatorCommon("CONNECTION_ERROR"));
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
            pathname === "/" ? styles.active : ""
          }`}
        >
          {translatorComponent("NAV_ITEM_HOME")}
        </Link>
        <div
          className={`
            ${styles.navigationItem}
            ${styles.navigationItemCreate}
            ${pathname === "/pin-builder" ? styles.active : ""}
          `}
          ref={createButtonRef}
          onClick={handleClickCreateButton}
        >
          {translatorComponent("CREATE")}
          <FontAwesomeIcon
            icon={faAngleDown}
            className={styles.createButtonIcon}
          />
        </div>
        {isCreateFlyoutOpen && (
          <div className={styles.createFlyout} ref={createFlyoutRef}>
            <Link href="/pin-builder" className={styles.createFlyoutItem}>
              {translatorComponent("CREATE_PIN")}
            </Link>
          </div>
        )}
        {/* Trick: we render <HeaderSearchBar /> with a key containing the current pathname.
        This way, the component will be re-rendered on each route transition, and its value
        will be cleared. */}
        <HeaderSearchBar key={`header-search-bar-pathname-${pathname}`} />
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
            {translatorComponent("YOUR_PROFILE")}
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
            {translatorComponent("ACCOUNT_OPTIONS")}
          </div>
        )}
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
