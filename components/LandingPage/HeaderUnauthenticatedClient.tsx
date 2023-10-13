"use client";

import Image from "next/image";
import styles from "./HeaderUnauthenticatedClient.module.css";

type HeaderUnauthenticatedClientProps = {
  handleClickLogInButton: () => void;
  handleClickSignUpButton: () => void;
  labels: { [key: string]: string };
};

const HeaderUnauthenticatedClient = ({
  handleClickLogInButton,
  handleClickSignUpButton,
  labels,
}: HeaderUnauthenticatedClientProps) => {
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
        {labels.LOG_IN}
      </button>
      <button
        className={styles.signUpButton}
        onClick={handleClickSignUpButton}
        data-testid="header-sign-up-button"
      >
        {labels.SIGN_UP}
      </button>
    </nav>
  );
};

export default HeaderUnauthenticatedClient;
