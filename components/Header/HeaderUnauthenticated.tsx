"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./HeaderUnauthenticated.module.css";

type HeaderUnauthenticatedProps = {
  handleClickLogInButton: () => void;
  handleClickSignUpButton: () => void;
};

const HeaderUnauthenticated = ({
  handleClickLogInButton,
  handleClickSignUpButton,
}: HeaderUnauthenticatedProps) => {
  const t = useTranslations("HeaderUnauthenticated");

  return (
    <nav className={styles.container}>
      <a href="/" className={styles.logoContainer}>
        <Image src="/images/logo.svg" alt="PinIt logo" width={32} height={32} />
        <h1 className={styles.logoHeader}>PinIt</h1>
      </a>
      <button
        className={styles.loginButton}
        onClick={handleClickLogInButton}
        data-testid="header-log-in-button"
      >
        {t("LOG_IN")}
      </button>
      <button
        className={styles.signUpButton}
        onClick={handleClickSignUpButton}
        data-testid="header-sign-up-button"
      >
        {t("SIGN_UP")}
      </button>
    </nav>
  );
};

export default HeaderUnauthenticated;
