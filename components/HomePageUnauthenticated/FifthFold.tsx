import { useState, useEffect, RefObject } from "react";
import styles from "./FifthFold.module.css";
import SignupForm from "../SignupForm/SignupForm";
import LoginForm from "../LoginForm/LoginForm";
import FifthFoldPicturesBackground from "./FifthFoldPicturesBackground";

type FifthFoldProps = {
  heroRef: RefObject<HTMLDivElement>;
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const FifthFold = ({ heroRef, labels }: FifthFoldProps) => {
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
    heroRef.current?.scrollIntoView();
  });

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
      </div>
      <footer className={styles.footer}></footer>
    </div>
  );
};

export default FifthFold;
