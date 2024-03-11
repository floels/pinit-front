import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faUser } from "@fortawesome/free-solid-svg-icons";
import HeaderSearchBarContainer from "./HeaderSearchBarContainer";
import styles from "./HeaderAuthenticated.module.css";
import { useLocale, useTranslations } from "next-intl";
import AccountOptionsFlyoutContainer from "./AccountOptionsFlyoutContainer";
import { forwardRef } from "react";

type HeaderAuthenticatedProps = {
  username: string | null;
  profilePictureURL: string | null;
  isProfileLinkHovered: boolean;
  isAccountOptionsButtonHovered: boolean;
  isAccountOptionsFlyoutOpen: boolean;
  handleMouseEnterProfileLink: () => void;
  handleMouseLeaveProfileLink: () => void;
  handleClickAccountOptionsButton: () => void;
  handleMouseEnterAccountOptionsButton: () => void;
  handleMouseLeaveAccountOptionsButton: () => void;
  handleClickOutOfAccountOptionsFlyout: () => void;
};

const HeaderAuthenticated = forwardRef<
  HTMLButtonElement,
  HeaderAuthenticatedProps
>((props, ref) => {
  const {
    username,
    profilePictureURL,
    isProfileLinkHovered,
    isAccountOptionsButtonHovered,
    isAccountOptionsFlyoutOpen,
    handleMouseEnterProfileLink,
    handleMouseLeaveProfileLink,
    handleClickAccountOptionsButton,
    handleMouseEnterAccountOptionsButton,
    handleMouseLeaveAccountOptionsButton,
    handleClickOutOfAccountOptionsFlyout,
  } = props;

  const pathname = usePathname();

  const locale = useLocale();

  const t = useTranslations("HeaderAuthenticated");

  let classHomeLink = styles.navigationItem;

  if (pathname === `/${locale}`) {
    classHomeLink = `${classHomeLink} ${styles.navigationItemActive}`;
  }

  let classCreateLink = styles.navigationItem;

  if (pathname === `/${locale}/pin-creation-tool`) {
    classCreateLink = `${classCreateLink} ${styles.navigationItemActive}`;
  }

  const profileLinkBadge = profilePictureURL ? (
    <Image
      src={profilePictureURL}
      alt={t("ALT_PROFILE_PICTURE")}
      width={24}
      height={24}
      className={styles.profilePicture}
      data-testid="profile-picture"
    />
  ) : (
    <div className={styles.profileLinkBadge}>
      <FontAwesomeIcon icon={faUser} data-testid="profile-link-icon" />
    </div>
  );

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
        <Link href="/" className={classHomeLink}>
          {t("NAV_ITEM_HOME")}
        </Link>
        <Link href="/pin-creation-tool/" className={classCreateLink}>
          {t("NAV_ITEM_CREATE")}
        </Link>
        {/* Trick: we render <HeaderSearchBar /> with a key containing the current pathname.
            This way, the component will be re-rendered on each route transition, and its value
            will be cleared. */}
        <HeaderSearchBarContainer
          key={`header-search-bar-pathname-${pathname}`}
        />
        {username && (
          <Link
            href={`/${username}`}
            className={styles.profileLink}
            data-testid="profile-link"
            onMouseEnter={handleMouseEnterProfileLink}
            onMouseLeave={handleMouseLeaveProfileLink}
          >
            {profileLinkBadge}
          </Link>
        )}
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
          ref={ref}
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
        <AccountOptionsFlyoutContainer
          handleClickOutOfAccountOptionsFlyout={
            handleClickOutOfAccountOptionsFlyout
          }
        />
      )}
    </nav>
  );
});

HeaderAuthenticated.displayName = "HeaderAuthenticated";

export default HeaderAuthenticated;
