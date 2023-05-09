import _ from "lodash";
import { useState } from "react";
import Image from "next/image";
import OverlayModal from "../OverlayModal/OverlayModal";
import LoginForm, { LoginFormProps } from "../LoginForm/LoginForm";
import SignupForm, { SignupFormProps } from "../SignupForm/SignupForm";
import styles from "./HeaderUnauthenticated.module.css";

type HeaderUnauthenticatedPros = {
  labels: { [key: string]: string };
};

const HeaderUnauthenticated = ({ labels }: HeaderUnauthenticatedPros) => {
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
            {
              ...({
                onClickNoAccountYet: handleClickNoAccountYet,
                labels: _.pick(labels, [
                  "WELCOME_TO_PINIT",
                  "EMAIL",
                  "PASSWORD",
                  "MISSING_EMAIL",
                  "INVALID_EMAIL_INPUT",
                  "INVALID_EMAIL_LOGIN",
                  "INVALID_PASSWORD_INPUT",
                  "INVALID_PASSWORD_LOGIN",
                  "CONNECTION_ERROR",
                  "UNFORESEEN_ERROR",
                  "LOG_IN",
                  "NO_ACCOUNT_YET",
                  "SIGN_UP",
                ]),
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
                onClickAlreadyHaveAccount: handleClickAlreadyHaveAccount,
                labels: _.pick(labels, [
                  "WELCOME_TO_PINIT",
                  "FIND_NEW_IDEAS",
                  "EMAIL",
                  "INVALID_EMAIL_SIGNUP",
                  "PASSWORD",
                  "CREATE_PASSWORD",
                  "INVALID_PASSWORD_SIGNUP",
                  "BIRTHDATE",
                  "INVALID_BIRTHDATE_SIGNUP",
                  "EMAIL_ALREADY_SIGNED_UP",
                  "CONNECTION_ERROR",
                  "UNFORESEEN_ERROR",
                  "CONTINUE",
                  "ALREADY_HAVE_ACCOUNT",
                  "LOG_IN",
                ]),
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
        {labels.LOG_IN}
      </button>
      <button className={styles.signUpButton} onClick={handleClickSignUpButton}>
        {labels.SIGN_UP}
      </button>
    </nav>
  );
};

export default HeaderUnauthenticated;
