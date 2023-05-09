import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {
  API_BASE_URL,
  ENDPOINT_OBTAIN_TOKEN,
  ERROR_CODE_INVALID_PASSWORD,
  ERROR_CODE_INVALID_EMAIL,
  ERROR_CODE_FETCH_FAILED,
} from "../../lib/constants";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./LoginForm.module.css";
import Image from "next/image";
import { isValidEmail, isValidPassword } from "../../lib/utils/helpers";

export type LoginFormProps = {
  setIsLoading: (isLoading: boolean) => void;
  onClickNoAccountYet: () => void;
  labels: { [key: string]: string };
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

const LoginForm = ({
  setIsLoading,
  onClickNoAccountYet,
  labels,
}: LoginFormProps) => {
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

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newValues = { ...credentials, [name]: value };
    setCredentials(newValues);
    setFormErrors(computeFormErrors(newValues));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setShowFormErrors(true);

    if (formErrors.email || formErrors.password) {
      // Invalid inputs: no need to make a request
      return;
    }

    setIsLoading(true);

    try {
      const { accessToken, refreshToken } = await fetchTokens();

      Cookies.set("accessToken", accessToken);
      Cookies.set("refreshToken", refreshToken);

      window.location.reload();
    } catch (error) {
      const errorCode = (error as Error).message;

      updateFormErrorsFromErrorCode(errorCode);
    }
  };

  const fetchTokens = async () => {
    let response, data;

    try {
      response = await fetch(`${API_BASE_URL}/${ENDPOINT_OBTAIN_TOKEN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      data = await response.json();
    } catch (error) {
      throw new Error(ERROR_CODE_FETCH_FAILED);
    } finally {
      setIsLoading(false);
    }

    if (!response.ok) {
      if (data?.errors?.length > 0) {
        throw new Error(data.errors[0]?.code);
      }
      throw new Error();
    }

    return { accessToken: data.access_token, refreshToken: data.refresh_token };
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

  return (
    <div className={styles.container}>
      <Image
        src="/images/logo.svg"
        alt="PinIt logo"
        width={40}
        height={40}
        className={styles.logo}
      />
      <h1 className={styles.title}>{labels.WELCOME_TO_PINIT}</h1>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            name="email"
            label={labels.EMAIL}
            placeholder={labels.EMAIL}
            type="email"
            value={credentials.email}
            errorMessage={
              showFormErrors && formErrors.email ? labels[formErrors.email] : ""
            }
            onChange={handleInputChange}
            autoComplete="email"
            ref={emailInputRef}
          />
        </div>
        <div className={styles.passwordInputContainer}>
          <LabelledTextInput
            name="password"
            label={labels.PASSWORD}
            placeholder={labels.PASSWORD}
            type="password"
            value={credentials.password}
            errorMessage={
              showFormErrors && formErrors.password
                ? labels[formErrors.password]
                : ""
            }
            onChange={handleInputChange}
            withPasswordShowIcon={true}
          />
        </div>
        {showFormErrors && formErrors.other && (
          <div className={styles.otherErrorMessage}>
            <FontAwesomeIcon icon={faCircleXmark} />
            <div className={styles.otherErrorText}>
              {labels[formErrors.other]}
            </div>
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          {labels.LOG_IN}
        </button>
      </form>
      <div className={styles.noAccountYet}>
        {labels.NO_ACCOUNT_YET}
        <button
          className={styles.noAccountYetButton}
          onClick={onClickNoAccountYet}
        >
          {labels.SIGN_UP}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
