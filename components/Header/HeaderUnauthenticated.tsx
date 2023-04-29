import { useState, useContext } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import OverlayModal from "../OverlayModal/OverlayModal";
import LoginForm, { LoginFormProps } from "../LoginForm/LoginForm";
import SignupForm, { SignupFormProps } from "../SignupForm/SignupForm";
import styles from "./HeaderUnauthenticated.module.css";

const HeaderUnauthenticated = () => {
  const t = useTranslations("HomePageUnauthenticated");

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

  const handleSuccessfulSignup = () => {
    // TODO: trigger page reload
  };

  return (
    <nav className={styles.container}>
      {isLoginModalOpen && (
        <OverlayModal onClose={handleCloseLoginModal}>
          <LoginForm
            {
              ...({
                onClickNoAccountYet: handleClickNoAccountYet,
              } as LoginFormProps)
              /* setIsLoading will be injected by <OverlayModal />*/
            }
          />
        </OverlayModal>
      )}
      {isSignupModalOpen && (
        <OverlayModal onClose={handleCloseSignupModal}>
          <SignupForm
            {
              ...({
                onSignupSuccess: handleSuccessfulSignup,
                onClickAlreadyHaveAccount: handleClickAlreadyHaveAccount,
              } as SignupFormProps)
              /* setIsLoading will be injected by <OverlayModal />*/
            }
          />
        </OverlayModal>
      )}
      <a href="/" className={styles.logoContainer}>
        <Image src="/images/logo.svg" alt="PinIt logo" width={32} height={32} />
        <h1 className={styles.logoHeader}>PinIt</h1>
      </a>
      <button className={styles.loginButton} onClick={handleClickLoginButton}>
        {t("LOG_IN")}
      </button>
      <button className={styles.signUpButton} onClick={handleClickSignUpButton}>
        {t("SIGN_UP")}
      </button>
    </nav>
  );
};

export default HeaderUnauthenticated;
