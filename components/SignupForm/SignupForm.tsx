import { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./SignupForm.module.css";

type FormData = {
  email: string;
  password: string;
  birthdate: string;
};

export type FormErrors = {
  email?: string;
  password?: string;
  birthdate?: string;
  other?: string;
};

type SignupFormProps = {
  formData: FormData;
  formErrors: FormErrors;
  showFormErrors: boolean;
  isLoading: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleClickAlreadyHaveAccount: () => void;
};

const SignupForm = ({
  formErrors,
  formData,
  handleInputChange,
  handleSubmit,
  isLoading,
  handleClickAlreadyHaveAccount,
  showFormErrors,
}: SignupFormProps) => {
  const t = useTranslations();

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  let displayFormErrorsOther;

  if (formErrors.other) {
    let text;

    switch (formErrors.other) {
      case "EMAIL_ALREADY_SIGNED_UP":
        text = t("LandingPageContent.SignupForm.EMAIL_ALREADY_SIGNED_UP");
        break;
      default:
        text = t("Common.UNFORESEEN_ERROR");
    }

    displayFormErrorsOther = (
      <div className={styles.otherErrorMessage}>
        <FontAwesomeIcon icon={faCircleXmark} />
        <div className={styles.otherErrorText}>{text}</div>
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
        {t("LandingPageContent.SignupForm.WELCOME_TO_PINIT")}
      </h1>
      <div className={styles.subtitle}>
        {t("LandingPageContent.SignupForm.FIND_NEW_IDEAS")}
      </div>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            name="email"
            label={t("LandingPageContent.SignupForm.EMAIL")}
            placeholder={t("LandingPageContent.SignupForm.EMAIL")}
            type="email"
            value={formData.email}
            autoComplete="email"
            errorMessage={
              showFormErrors && formErrors.email
                ? t(`LandingPageContent.SignupForm.${formErrors.email}`)
                : ""
            }
            onChange={handleInputChange}
            ref={emailInputRef}
          />
        </div>
        <div className={styles.passwordInputContainer}>
          <LabelledTextInput
            name="password"
            label={t("LandingPageContent.SignupForm.PASSWORD")}
            placeholder={t("LandingPageContent.SignupForm.CREATE_PASSWORD")}
            type="password"
            value={formData.password}
            autoComplete="new-password"
            errorMessage={
              showFormErrors && formErrors.password
                ? t(`LandingPageContent.SignupForm.${formErrors.password}`)
                : ""
            }
            onChange={handleInputChange}
            withPasswordShowIcon
          />
        </div>
        <div className={styles.birthdateInputContainer}>
          <LabelledTextInput
            name="birthdate"
            label={t("LandingPageContent.SignupForm.BIRTHDATE")}
            type="date"
            value={formData.birthdate}
            autoComplete="bday"
            errorMessage={
              showFormErrors && formErrors.birthdate
                ? t(`LandingPageContent.SignupForm.${formErrors.birthdate}`)
                : ""
            }
            onChange={handleInputChange}
          />
        </div>
        {showFormErrors && displayFormErrorsOther}
        <button type="submit" className={styles.submitButton}>
          {t("LandingPageContent.SignupForm.CONTINUE")}
        </button>
      </form>
      <button
        className={styles.alreadyHaveAccount}
        onClick={handleClickAlreadyHaveAccount}
      >
        {t("LandingPageContent.SignupForm.ALREADY_HAVE_ACCOUNT_CTA")}
      </button>
      {isLoading && (
        <div
          className={styles.loadingOverlay}
          data-testid="signup-form-loading-overlay"
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

export default SignupForm;
