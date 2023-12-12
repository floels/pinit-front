import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AccountOptionsFlyout from "./AccountOptionsFlyout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import HeaderSearchBar from "./HeaderSearchBar";
import styles from "./HeaderAuthenticated.module.css";
import { useTranslations } from "next-intl";
import { AccountType } from "@/lib/types";

type HeaderAuthenticatedProps = {
  handleClickCreateButton: () => void;
  isCreateFlyoutOpen: boolean;
  handleMouseEnterProfileLink: () => void;
  handleMouseLeaveProfileLink: () => void;
  isProfileLinkHovered: boolean;
  handleClickAccountOptionsButton: () => void;
  handleMouseEnterAccountOptionsButton: () => void;
  handleMouseLeaveAccountOptionsButton: () => void;
  isAccountOptionsButtonHovered: boolean;
  isAccountOptionsFlyoutOpen: boolean;
  handleClickLogOut: () => void;
  isFetching: boolean;
  fetchFailed: boolean;
  ownedAccounts: AccountType[];
};

const HeaderAuthenticated = React.forwardRef<any, HeaderAuthenticatedProps>(
  (
    {
      handleClickCreateButton,
      isCreateFlyoutOpen,
      handleMouseEnterProfileLink,
      handleMouseLeaveProfileLink,
      isProfileLinkHovered,
      handleClickAccountOptionsButton,
      handleMouseEnterAccountOptionsButton,
      handleMouseLeaveAccountOptionsButton,
      isAccountOptionsButtonHovered,
      isAccountOptionsFlyoutOpen,
      handleClickLogOut,
      isFetching,
      fetchFailed,
      ownedAccounts,
    },
    ref,
  ) => {
    const pathname = usePathname();

    const t = useTranslations("HeaderAuthenticated");

    const {
      createFlyoutRef,
      createButtonRef,
      accountOptionsFlyoutRef,
      accountOptionsButtonRef,
    } = ref as any;

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
            {t("NAV_ITEM_HOME")}
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
            {t("CREATE")}
            <FontAwesomeIcon
              icon={faAngleDown}
              className={styles.createButtonIcon}
            />
          </div>
          {isCreateFlyoutOpen && (
            <div className={styles.createFlyout} ref={createFlyoutRef}>
              <Link href="/pin-builder" className={styles.createFlyoutItem}>
                {t("CREATE_PIN")}
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
              {t("YOUR_PROFILE")}
            </div>
          )}
          <button
            className={styles.accountOptionsButton}
            data-testid="account-options-button"
            onClick={handleClickAccountOptionsButton}
            onMouseEnter={handleMouseEnterAccountOptionsButton}
            onMouseLeave={handleMouseLeaveAccountOptionsButton}
            ref={accountOptionsButtonRef}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </button>
          {isAccountOptionsButtonHovered && (
            <div
              className={`${styles.tooltip} ${styles.accountOptionsButtonTooltip}`}
            >
              {t("ACCOUNT_OPTIONS")}
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
  },
);

HeaderAuthenticated.displayName = "HeaderAuthenticated";

export default HeaderAuthenticated;
