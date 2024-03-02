import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./LoginForm.module.css";

type Credentials = {
  email: string;
  password: string;
};

export type FormErrors = {
  email?: string;
  password?: string;
  other?: string;
};

type LoginFormProps = {
  credentials: Credentials;
  formErrors: FormErrors;
  showFormErrors: boolean;
  isLoading: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClickNoAccountYet: () => void;
};

const LoginForm = ({
  credentials,
  formErrors,
  showFormErrors,
  isLoading,
  handleInputChange,
  handleSubmit,
  onClickNoAccountYet,
}: LoginFormProps) => {
  const t = useTranslations();

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  let displayFormErrorsOther;

  if (formErrors.other) {
    displayFormErrorsOther = (
      <div className={styles.otherErrorMessage}>
        <FontAwesomeIcon icon={faCircleXmark} />
        <div className={styles.otherErrorText}>
          {t("Common.UNFORESEEN_ERROR")}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Image
        src="/images/logo.svg"
        alt="PinIt logo"
        width={40}
        height={40}
        className={styles.logo}
      />
      <h1 className={styles.title}>
        {t("LandingPageContent.LoginForm.WELCOME_TO_PINIT")}
      </h1>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            name="email"
            label={t("LandingPageContent.LoginForm.EMAIL")}
            placeholder={t("LandingPageContent.LoginForm.EMAIL")}
            type="email"
            value={credentials.email}
            errorMessage={
              showFormErrors && formErrors.email
                ? t(`LandingPageContent.LoginForm.${formErrors.email}`)
                : ""
            }
            onChange={handleInputChange}
            autoComplete="email"
            ref={emailInputRef}
          />
        </div>
        <div className={styles.passwordInputContainer}>
          <LabelledTextInput
            name="password"
            label={t("LandingPageContent.LoginForm.PASSWORD")}
            placeholder={t("LandingPageContent.LoginForm.PASSWORD")}
            type="password"
            value={credentials.password}
            errorMessage={
              showFormErrors && formErrors.password
                ? t(`LandingPageContent.LoginForm.${formErrors.password}`)
                : ""
            }
            onChange={handleInputChange}
            withPasswordShowIcon={true}
          />
        </div>
        {showFormErrors && displayFormErrorsOther}
        <button
          type="submit"
          className={styles.submitButton}
          data-testid="login-form-submit-button"
        >
          {t("LandingPageContent.LoginForm.LOG_IN")}
        </button>
      </form>
      <div className={styles.noAccountYet}>
        {t("LandingPageContent.LoginForm.NO_ACCOUNT_YET")}
        <button
          className={styles.noAccountYetButton}
          onClick={onClickNoAccountYet}
        >
          {t("LandingPageContent.LoginForm.SIGN_UP")}
        </button>
      </div>
      {isLoading && (
        <div
          className={styles.loadingOverlay}
          data-testid="login-form-loading-overlay"
        >
          <FontAwesomeIcon
            icon={faSpinner}
            size="2x"
            spin
            className={styles.loadingSpinner}
          />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
