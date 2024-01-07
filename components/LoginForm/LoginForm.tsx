import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ERROR_CODE_INVALID_PASSWORD,
  ERROR_CODE_INVALID_EMAIL,
  ERROR_CODE_FETCH_FAILED,
  API_ROUTE_OBTAIN_TOKEN,
  ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
} from "../../lib/constants";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./LoginForm.module.css";
import { isValidEmail, isValidPassword } from "../../lib/utils/validation";

type LoginFormProps = {
  onClickNoAccountYet: () => void;
};

const computeFormErrors = (values: { email: string; password: string }) => {
  if (!values.email) {
    return { email: "MISSING_EMAIL" };
  }

  if (!isValidEmail(values.email)) {
    return { email: "INVALID_EMAIL_INPUT" };
  }

  if (!isValidPassword(values.password)) {
    return { password: "INVALID_PASSWORD_INPUT" };
  }

  return {};
};

const LoginForm = ({ onClickNoAccountYet }: LoginFormProps) => {
  const t = useTranslations();

  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement>(null);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    other?: string;
  }>({ email: "MISSING_EMAIL" });
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newCredentials = { ...credentials, [name]: value };

    setCredentials(newCredentials);

    setFormErrors(computeFormErrors(newCredentials));

    setShowFormErrors(false);
  };

  const setAccessTokenExpirationDate = (expirationDate: string) => {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    localStorage.setItem(
      ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
      expirationDate,
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setShowFormErrors(true);

    if (formErrors.email || formErrors.password) {
      // Invalid inputs: no need to make a request
      return;
    }

    setIsLoading(true);

    let response;

    try {
      response = await fetchTokens();
    } catch (error) {
      const errorCode = (error as Error).message;
      updateFormErrorsFromErrorCode(errorCode);
      return;
    }

    let responseData;

    try {
      responseData = await response.json();
    } catch {
      // We couldn't retrieve the access token expiration date
      // By default, clear it:
      setAccessTokenExpirationDate("");

      router.refresh();

      return;
    }

    setAccessTokenExpirationDate(responseData.access_token_expiration_utc);

    router.refresh();
  };

  const fetchTokens = async () => {
    let response;

    try {
      response = await fetch(API_ROUTE_OBTAIN_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
    } catch {
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

    return response;
  };

  const updateFormErrorsFromErrorCode = (errorCode: string) => {
    switch (errorCode) {
      case ERROR_CODE_FETCH_FAILED:
        setFormErrors({ other: "CONNECTION_ERROR" });
        break;
      case ERROR_CODE_INVALID_EMAIL:
        setFormErrors({ email: "INVALID_EMAIL_LOGIN" });
        break;
      case ERROR_CODE_INVALID_PASSWORD:
        setFormErrors({ password: "INVALID_PASSWORD_LOGIN" });
        break;
      default:
        setFormErrors({ other: "UNFORESEEN_ERROR" });
    }
  };

  let displayFormErrorsOther;

  if (formErrors.other) {
    const text =
      formErrors.other === "CONNECTION_ERROR"
        ? t("Common.CONNECTION_ERROR")
        : t("Common.UNFORESEEN_ERROR");

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
        <button type="submit" className={styles.submitButton}>
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
