import { useState, useContext } from "react";
import { useIntl } from "react-intl";
import Image from "next/image";
import GlobalStateContext from "../../app/globalState";
import OverlayModal from "../OverlayModal/OverlayModal";
import LoginForm, { LoginFormProps } from "../LoginForm/LoginForm";
import SignupForm, { SignupFormProps } from "../SignupForm/SignupForm";
import styles from "./HeaderUnauthenticated.module.css";

const HeaderUnauthenticated = () => {
  const intl = useIntl();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const { dispatch } = useContext(GlobalStateContext);

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

  const handleSuccessfulLogin = () => {
    dispatch({ type: "SET_IS_AUTHENTICATED", payload: true });
    setIsLoginModalOpen(false);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleSuccessfulSignup = () => {
    dispatch({ type: "SET_IS_AUTHENTICATED", payload: true });
    setIsSignupModalOpen(false);
  };

  return (
    <nav className={styles.container}>
      {isLoginModalOpen && (
        <OverlayModal onClose={handleCloseLoginModal}>
          <LoginForm
            {
              ...({
                onLoginSuccess: handleSuccessfulLogin,
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
        {intl.formatMessage({ id: "LOG_IN" })}
      </button>
      <button className={styles.signUpButton} onClick={handleClickSignUpButton}>
        {intl.formatMessage({ id: "SIGN_UP" })}
      </button>
    </nav>
  );
};

export default HeaderUnauthenticated;
