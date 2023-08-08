import { useState } from "react";
import styles from "./FifthFold.module.css";
import SignupForm from "../SignupForm/SignupForm";
import LoginForm from "../LoginForm/LoginForm";
import FifthFoldPicturesBackground from "./FifthFoldPicturesBackground";

type FifthFoldProps = {
  labels: {
    component: { [key: string]: any };
    commons: { [key: string]: string };
  };
};

const FifthFold = ({ labels }: FifthFoldProps) => {
  const [showLoginInsteadOfSignup, setShowLoginInsteadOfSignup] =
    useState(false);

  const handleClickAlreadyHaveAccount = () => {
    setShowLoginInsteadOfSignup(true);
  };

  const handleClickNoAccountYet = () => {
    setShowLoginInsteadOfSignup(false);
  };

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
