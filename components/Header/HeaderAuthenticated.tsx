import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AccountOptionsFlyout from "./AccountOptionsFlyout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import HeaderSearchBar from "./HeaderSearchBar";
import styles from "./HeaderAuthenticated.module.css";
import { useLocale, useTranslations } from "next-intl";

type HeaderAuthenticatedProps = {
  handleMouseEnterProfileLink: () => void;
  handleMouseLeaveProfileLink: () => void;
  isProfileLinkHovered: boolean;
  handleClickAccountOptionsButton: () => void;
  handleMouseEnterAccountOptionsButton: () => void;
  handleMouseLeaveAccountOptionsButton: () => void;
  isAccountOptionsButtonHovered: boolean;
  isAccountOptionsFlyoutOpen: boolean;
};

const HeaderAuthenticated = React.forwardRef<any, HeaderAuthenticatedProps>(
  (
    {
      handleMouseEnterProfileLink,
      handleMouseLeaveProfileLink,
      isProfileLinkHovered,
      handleClickAccountOptionsButton,
      handleMouseEnterAccountOptionsButton,
      handleMouseLeaveAccountOptionsButton,
      isAccountOptionsButtonHovered,
      isAccountOptionsFlyoutOpen,
    },
    ref,
  ) => {
    const pathname = usePathname();

    const locale = useLocale();

    const t = useTranslations("HeaderAuthenticated");

    const { accountOptionsFlyoutRef, accountOptionsButtonRef } = ref as any;

    let classHomeLink = styles.navigationItem;

    if (pathname === `/${locale}`) {
      classHomeLink = `${classHomeLink} ${styles.navigationItemActive}`;
    }

    let classCreateLink = styles.navigationItem;

    if (pathname === `/${locale}/pin-creation-tool`) {
      classCreateLink = `${classCreateLink} ${styles.navigationItemActive}`;
    }

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
          <Link href={`/${locale}`} className={classHomeLink}>
            {t("NAV_ITEM_HOME")}
          </Link>
          <Link
            href={`/${locale}/pin-creation-tool`}
            className={classCreateLink}
          >
            {t("NAV_ITEM_CREATE")}
          </Link>
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
          <AccountOptionsFlyout ref={accountOptionsFlyoutRef} />
        )}
      </nav>
    );
  },
);

HeaderAuthenticated.displayName = "HeaderAuthenticated";

export default HeaderAuthenticated;
