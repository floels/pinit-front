"use client";

import { useState } from "react";
import Image from "next/image";
import OverlayModal from "../OverlayModal/OverlayModal";
import LoginForm from "../LoginForm/LoginForm";
import SignupForm from "../SignupForm/SignupForm";
import styles from "./HeaderUnauthenticatedClient.module.css";

type HeaderUnauthenticatedClientProps = {
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const HeaderUnauthenticatedClient = ({
  labels,
}: HeaderUnauthenticatedClientProps) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleClickLoginButton = () => {
    setIsLoginModalOpen(true);
  };

  const handleClickSignUpButton = () => {
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
      {isLoginModalOpen && (
        <OverlayModal onClose={handleCloseLoginModal}>
          <LoginForm
            onClickNoAccountYet={handleClickNoAccountYet}
            labels={{
              component: labels.component.LoginForm,
              commons: labels.commons,
            }}
          />
        </OverlayModal>
      )}
      {isSignupModalOpen && (
        <OverlayModal onClose={handleCloseSignupModal}>
          <SignupForm
            onClickAlreadyHaveAccount={handleClickAlreadyHaveAccount}
            labels={{
              component: labels.component.SignupForm,
              commons: labels.commons,
            }}
          />
        </OverlayModal>
      )}
      <a href="/" className={styles.logoContainer}>
        <Image src="/images/logo.svg" alt="PinIt logo" width={32} height={32} />
        <h1 className={styles.logoHeader}>PinIt</h1>
      </a>
      <button className={styles.loginButton} onClick={handleClickLoginButton}>
        {labels.component.LOG_IN}
      </button>
      <button className={styles.signUpButton} onClick={handleClickSignUpButton}>
        {labels.component.SIGN_UP}
      </button>
    </nav>
  );
};

export default HeaderUnauthenticatedClient;
