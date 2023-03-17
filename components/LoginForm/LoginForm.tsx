import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {
  API_BASE_URL,
  ENDPOINT_OBTAIN_TOKEN,
  ERROR_CODE_INVALID_PASSWORD,
  ERROR_CODE_INVALID_USERNAME,
} from "@/lib/constants";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./LoginForm.module.css";
import { useIntl } from "react-intl";
import Image from "next/image";
import { isValidEmail, isValidPassword } from "@/lib/helpers";

export type LoginFormProps = {
  onLoginSuccess: () => void;
  setIsLoading: (isLoading: boolean) => void;
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

const LoginForm = ({ setIsLoading, onLoginSuccess }: LoginFormProps) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
          username: credentials.email,
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
      if (response.status == 401) {
        if (data.errors[0].code == ERROR_CODE_INVALID_USERNAME) {
          setFormErrors({ email: "INVALID_USERNAME" });
        } else if (data.errors[0].code == ERROR_CODE_INVALID_PASSWORD) {
          setFormErrors({ password: "INVALID_PASSWORD" });
        } else {
          setFormErrors({ other: "UNFORESEEN_ERROR" });
        }
      } else {
        setFormErrors({ other: "UNFORESEEN_ERROR" });
      }
      return;
    }

    Cookies.set("accessToken", data.access);
    Cookies.set("refreshToken", data.refresh);

    onLoginSuccess();

    router.push("/");
  };

  const intl = useIntl();

  return (
    <div className={styles.container}>
      <Image
        src="/logo.svg"
        alt="PinIt logo"
        width={40}
        height={40}
        className={styles.logo}
      />
      <h1 className={styles.title}>
        {intl.formatMessage({ id: "WELCOME_TO_PINIT" })}
      </h1>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            name="email"
            labelMessageId={"EMAIL"}
            placeholderMessageId={"EMAIL"}
            type="email"
            value={credentials.email}
            errorMessageId={showFormErrors ? formErrors.email : ""}
            onChange={handleInputChange}
            autoComplete="email"
            ref={emailInputRef}
          />
        </div>
        <div className={styles.passwordInputContainer}>
          <LabelledTextInput
            name="password"
            labelMessageId={"PASSWORD"}
            placeholderMessageId={"PASSWORD"}
            type="password"
            value={credentials.password}
            errorMessageId={showFormErrors ? formErrors.password : ""}
            onChange={handleInputChange}
            withPasswordShowIcon={true}
          />
        </div>
        {showFormErrors && formErrors.other && (
          <div className={styles.otherErrorMessage}>
            <FontAwesomeIcon icon={faCircleXmark} />
            <div className={styles.otherErrorText}>
              {intl.formatMessage({ id: formErrors.other })}
            </div>
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          {intl.formatMessage({ id: "SIGN_IN" })}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
