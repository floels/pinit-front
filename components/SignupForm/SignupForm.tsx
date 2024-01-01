import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  API_ROUTE_SIGN_UP,
  ERROR_CODE_EMAIL_ALREADY_SIGNED_UP,
  ERROR_CODE_FETCH_FAILED,
  ERROR_CODE_INVALID_BIRTHDATE,
  ERROR_CODE_INVALID_EMAIL,
  ERROR_CODE_INVALID_PASSWORD,
} from "../../lib/constants";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./SignupForm.module.css";
import {
  isValidBirthdate,
  isValidEmail,
  isValidPassword,
} from "../../lib/utils/validation";

type SignupFormProps = {
  onClickAlreadyHaveAccount: () => void;
};

const computeFormErrors = (values: {
  email: string;
  password: string;
  birthdate: string;
}) => {
  if (!values.email) {
    return { email: "MISSING_EMAIL" };
  }

  if (!isValidEmail(values.email)) {
    return { email: "INVALID_EMAIL_INPUT" };
  }

  if (!isValidPassword(values.password)) {
    return { password: "INVALID_PASSWORD_INPUT" };
  }

  if (!isValidBirthdate(values.birthdate)) {
    return { birthdate: "INVALID_BIRTHDATE_INPUT" };
  }

  return {};
};

const SignupForm = ({ onClickAlreadyHaveAccount }: SignupFormProps) => {
  const t = useTranslations();

  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    birthdate: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    birthdate?: string;
    other?: string;
  }>({ email: "MISSING_EMAIL" });
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newFormData = { ...formData, [name]: value };

    setFormData(newFormData);

    setFormErrors(computeFormErrors(newFormData));

    setShowFormErrors(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setShowFormErrors(true);

    if (formErrors.email || formErrors.password || formErrors.birthdate) {
      // Invalid inputs: no need to make a request
      return;
    }

    setIsLoading(true);

    try {
      await fetchSignup();

      router.refresh();
    } catch (error) {
      const errorCode = (error as Error).message;

      updateFormErrorsFromErrorCode(errorCode);
    }
  };

  const fetchSignup = async () => {
    let response;

    try {
      response = await fetch(API_ROUTE_SIGN_UP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      throw new Error(ERROR_CODE_FETCH_FAILED);
    } finally {
      setIsLoading(false);
    }

    if (!response.ok) {
      const data = await response.json();

      if (data?.errors?.length > 0) {
        const firstErrorCode = data.errors[0]?.code;

        throw new Error(firstErrorCode);
      }

      throw new Error();
    }
  };

  const updateFormErrorsFromErrorCode = (errorCode: string) => {
    switch (errorCode) {
      case ERROR_CODE_FETCH_FAILED:
        setFormErrors({ other: "CONNECTION_ERROR" });
        break;
      case ERROR_CODE_INVALID_EMAIL:
        setFormErrors({ email: "INVALID_EMAIL_SIGNUP" });
        break;
      case ERROR_CODE_INVALID_PASSWORD:
        setFormErrors({ password: "INVALID_PASSWORD_SIGNUP" });
        break;
      case ERROR_CODE_INVALID_BIRTHDATE:
        setFormErrors({ birthdate: "INVALID_BIRTHDATE_SIGNUP" });
        break;
      case ERROR_CODE_EMAIL_ALREADY_SIGNED_UP:
        setFormErrors({ other: "EMAIL_ALREADY_SIGNED_UP" });
        break;
      default:
        setFormErrors({ other: "UNFORESEEN_ERROR" });
    }
  };

  let displayFormErrorsOther;

  if (formErrors.other) {
    let text;

    switch (formErrors.other) {
      case "CONNECTION_ERROR":
        text = t("Common.CONNECTION_ERROR");
        break;
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
            withPasswordShowIcon={true}
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
      <div className={styles.alreadyHaveAccount}>
        {t("LandingPageContent.SignupForm.ALREADY_HAVE_ACCOUNT")}
        <button
          className={styles.alreadyHaveAccountButton}
          onClick={onClickAlreadyHaveAccount}
        >
          {t("LandingPageContent.SignupForm.LOG_IN")}
        </button>
      </div>
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
