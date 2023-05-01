import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  API_BASE_URL,
  ENDPOINT_SIGN_UP,
  ERROR_CODE_EMAIL_ALREADY_SIGNED_UP,
  ERROR_CODE_INVALID_BIRTHDATE,
  ERROR_CODE_INVALID_EMAIL,
  ERROR_CODE_INVALID_PASSWORD,
} from "../../lib/constants";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./SignupForm.module.css";
import Image from "next/image";
import {
  isValidBirthdate,
  isValidEmail,
  isValidPassword,
} from "../../lib/helpers";

export type SignupFormProps = {
  setIsLoading: (isLoading: boolean) => void;
  onClickAlreadyHaveAccount: () => void;
  labels: { [key: string]: string };
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

const SignupForm = ({
  setIsLoading,
  onClickAlreadyHaveAccount,
  labels,
}: SignupFormProps) => {
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

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    setFormErrors(computeFormErrors(newFormData));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setShowFormErrors(true);

    if (formErrors.email || formErrors.password || formErrors.birthdate) {
      // Invalid inputs: no need to make a request
      return;
    }

    setIsLoading(true);

    let data, response;

    try {
      response = await fetch(`${API_BASE_URL}/${ENDPOINT_SIGN_UP}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      data = await response.json();
    } catch (error) {
      setFormErrors({ other: "CONNECTION_ERROR" });
      return;
    } finally {
      setIsLoading(false);
    }

    if (!response.ok) {
      if (response.status === 400) {
        const firstErrorCode = data.errors[0].code;

        if (firstErrorCode === ERROR_CODE_INVALID_EMAIL) {
          setFormErrors({ email: "INVALID_EMAIL_SIGNUP" });
        } else if (firstErrorCode === ERROR_CODE_INVALID_PASSWORD) {
          setFormErrors({ password: "INVALID_PASSWORD_SIGNUP" });
        } else if (firstErrorCode === ERROR_CODE_INVALID_BIRTHDATE) {
          setFormErrors({ birthdate: "INVALID_BIRTHDATE_SIGNUP" });
        } else if (firstErrorCode === ERROR_CODE_EMAIL_ALREADY_SIGNED_UP) {
          setFormErrors({ other: "EMAIL_ALREADY_SIGNED_UP" });
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
      <h1 className={styles.title}>{labels.WELCOME_TO_PINIT}</h1>
      <div className={styles.subtitle}>{labels.FIND_NEW_IDEAS}</div>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            name="email"
            label={labels.EMAIL}
            placeholder={labels.EMAIL}
            type="email"
            value={formData.email}
            autoComplete="email"
            errorMessage={
              showFormErrors && formErrors.email ? labels[formErrors.email] : ""
            }
            onChange={handleInputChange}
            ref={emailInputRef}
          />
        </div>
        <div className={styles.passwordInputContainer}>
          <LabelledTextInput
            name="password"
            label={labels.PASSWORD}
            placeholder={labels.CREATE_PASSWORD}
            type="password"
            value={formData.password}
            autoComplete="new-password"
            errorMessage={
              showFormErrors && formErrors.password
                ? labels[formErrors.password]
                : ""
            }
            onChange={handleInputChange}
            withPasswordShowIcon={true}
          />
        </div>
        <div className={styles.birthdateInputContainer}>
          <LabelledTextInput
            name="birthdate"
            label={labels.BIRTHDATE}
            type="date"
            value={formData.birthdate}
            autoComplete="bday"
            errorMessage={
              showFormErrors && formErrors.birthdate
                ? labels[formErrors.birthdate]
                : ""
            }
            onChange={handleInputChange}
          />
        </div>
        {showFormErrors && formErrors.other && (
          <div className={styles.otherErrorMessage}>
            <div className={styles.otherErrorText}>
              {labels[formErrors.other]}
            </div>
          </div>
        )}
        <button type="submit" className={styles.submitButton}>
          {labels.CONTINUE}
        </button>
      </form>
      <div className={styles.alreadyHaveAccount}>
        {labels.ALREADY_HAVE_ACCOUNT}
        <button
          className={styles.alreadyHaveAccountButton}
          onClick={onClickAlreadyHaveAccount}
        >
          {labels.LOG_IN}
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
