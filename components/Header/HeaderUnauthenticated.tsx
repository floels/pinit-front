"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import OverlayModal from "../OverlayModal/OverlayModal";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";
import styles from "./HeaderUnauthenticated.module.css";
import { useState } from "react";

const HeaderUnauthenticated = () => {
  const t = useTranslations("HeaderUnauthenticated");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openLogInModal = () => {
    setIsLoginModalOpen(true);
  };

  const openSignUpModal = () => {
    setIsSignupModalOpen(true);
  };

  const handleClickNoAccountYet = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleClickAlreadyHaveAccount = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  return (
    <nav className={styles.container}>
      <a href="/" className={styles.logoContainer}>
        <Image src="/images/logo.svg" alt="PinIt logo" width={32} height={32} />
        <h1 className={styles.logoHeader}>PinIt</h1>
      </a>
      <button
        className={styles.loginButton}
        onClick={openLogInModal}
        data-testid="header-log-in-button"
      >
        {t("LOG_IN")}
      </button>
      <button
        className={styles.signUpButton}
        onClick={openSignUpModal}
        data-testid="header-sign-up-button"
      >
        {t("SIGN_UP")}
      </button>
      {isLoginModalOpen && (
        <OverlayModal onClose={handleCloseLoginModal}>
          <LoginForm onClickNoAccountYet={handleClickNoAccountYet} />
        </OverlayModal>
      )}
      {isSignupModalOpen && (
        <OverlayModal onClose={handleCloseSignupModal}>
          <SignupForm
            onClickAlreadyHaveAccount={handleClickAlreadyHaveAccount}
          />
        </OverlayModal>
      )}
    </nav>
  );
};

export default HeaderUnauthenticated;
