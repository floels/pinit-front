import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import {
  API_BASE_URL,
  ENDPOINT_OBTAIN_TOKEN,
  ERROR_CODE_INVALID_PASSWORD,
  ERROR_CODE_INVALID_EMAIL,
} from "../../lib/constants";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./LoginForm.module.css";
import Image from "next/image";
import { isValidEmail, isValidPassword } from "../../lib/helpers";

export type LoginFormProps = {
  setIsLoading: (isLoading: boolean) => void;
  onClickNoAccountYet: () => void;
  labels: { [key: string]: string };
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

const LoginForm = ({ setIsLoading, onClickNoAccountYet, labels }: LoginFormProps) => {
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

    let data, response;

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
      setFormErrors({ other: "CONNECTION_ERROR" });
      return;
    } finally {
      setIsLoading(false);
    }

    if (!response.ok) {
      if (response.status === 401) {
        const firstErrorCode = data.errors[0].code;

        if (firstErrorCode === ERROR_CODE_INVALID_EMAIL) {
          setFormErrors({ email: "INVALID_EMAIL_LOGIN" });
        } else if (firstErrorCode === ERROR_CODE_INVALID_PASSWORD) {
          setFormErrors({ password: "INVALID_PASSWORD_LOGIN" });
        } else {
          // Unknown error code
          setFormErrors({ other: "UNFORESEEN_ERROR" });
        }
      } else {
        // Unknown response status code
        setFormErrors({ other: "UNFORESEEN_ERROR" });
      }
      return;
    }

    const { access, refresh } = data;

    if (!access || !refresh) {
      // Abnormal response
      setFormErrors({ other: "UNFORESEEN_ERROR" });
      return;
    }

    Cookies.set("accessToken", access);
    Cookies.set("refreshToken", refresh);

    window.location.reload();
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
      <h1 className={styles.title}>
        {labels.WELCOME_TO_PINIT}
      </h1>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            name="email"
            label={labels.EMAIL}
            placeholder={labels.EMAIL}
            type="email"
            value={credentials.email}
            errorMessage={
              showFormErrors && formErrors.email
                ? labels[formErrors.email]
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
