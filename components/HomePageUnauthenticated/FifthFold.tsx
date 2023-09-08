import { useState, useEffect, RefObject } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./FifthFold.module.css";
import SignupForm from "../SignupForm/SignupForm";
import LoginForm from "../LoginForm/LoginForm";
import FifthFoldPicturesBackground from "./FifthFoldPicturesBackground";

type FifthFoldProps = {
  heroRef: RefObject<HTMLDivElement>;
  onClickBackToTop: () => void;
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const FifthFold = ({ heroRef, onClickBackToTop, labels }: FifthFoldProps) => {
  const [showLoginInsteadOfSignup, setShowLoginInsteadOfSignup] =
    useState(false);

  const handleClickAlreadyHaveAccount = () => {
    setShowLoginInsteadOfSignup(true);
  };

  const handleClickNoAccountYet = () => {
    setShowLoginInsteadOfSignup(false);
  };

  // This is needed to scroll back to the top of the page.
  // Otherwise, for some reason, browsers scroll down to the first input of the
  // <SignupForm /> rendered below on page load.
  useEffect(() => {
    if (heroRef.current?.scrollIntoView) {
      heroRef.current.scrollIntoView();
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <FifthFoldPicturesBackground
          labels={labels.component.PicturesBackground}
        />
        <div className={styles.overlay}>
          <div className={styles.textArea}>
            <h1 className={styles.header}>{labels.component.SIGNUP_HEADER}</h1>
          </div>
          <div className={styles.formArea}>
            <div className={styles.formContainer}>
              {!showLoginInsteadOfSignup && (
                <SignupForm
                  onClickAlreadyHaveAccount={handleClickAlreadyHaveAccount}
                  labels={{
                    commons: labels.commons,
                    component: labels.component.SignupForm,
                  }}
                />
              )}
              {showLoginInsteadOfSignup && (
                <LoginForm
                  onClickNoAccountYet={handleClickNoAccountYet}
                  labels={{
                    commons: labels.commons,
                    component: labels.component.LoginForm,
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div
          className={styles.backToTopButton}
          onClick={onClickBackToTop}
          data-testid="back-to-top-button"
        >
          <FontAwesomeIcon
            icon={faAngleUp}
            className={styles.backToTopButtonIcon}
            size="2x"
          />
        </div>
      </div>
      <footer className={styles.footer}>
        <a href="#" className={styles.footerLink}>
          {labels.component.TERMS_OF_SERVICE}
        </a>
        <a href="#" className={styles.footerLink}>
          {labels.component.PRIVACY_POLICY}
        </a>
        <a href="#" className={styles.footerLink}>
          {labels.component.HELP}
        </a>
      </footer>
    </div>
  );
};

export default FifthFold;
