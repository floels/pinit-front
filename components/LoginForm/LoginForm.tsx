import { API_BASE_URL, TOKEN_OBTAIN_ENDPOINT } from "@/lib/constants";
import { useRef, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./LoginForm.module.css";
import { FormattedMessage } from "react-intl";
import Image from "next/image";
import { isValidEmail, isValidPassword } from "@/lib/helpers";

type LoginFormProps = {
  setModalIsLoading: (isLoading: boolean) => void;
  onLoginSuccess: () => void;
};

const computeFormErrors = (values: { email: string; password: string }) => {
  if (!values.email) {
    return { email: "MISSING_EMAIL" };
  }

  if (!isValidEmail(values.email)) {
    return { email: "WRONG_EMAIL" };
  }

  if (!isValidPassword(values.password)) {
    return { password: "WRONG_PASSWORD" };
  }

  return {};
};

const LoginForm = ({ setModalIsLoading, onLoginSuccess }: LoginFormProps) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({ email: "MISSING_EMAIL" });
  const [showFormErrors, setShowFormErrors] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const newValues = { ...credentials, [name]: value };
    setCredentials(newValues);
    setFormErrors(computeFormErrors(newValues));
    setLoginError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.keys(formErrors).length) {
      setShowFormErrors(true);
      return;
    }

    setModalIsLoading(true);

    let response;

    try {
      response = await fetch(`${API_BASE_URL}/${TOKEN_OBTAIN_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password,
        }),
      });
    } catch (error) {
      setModalIsLoading(false);
      setFetchError(true); // TODO: display error in DOM
      return;
    }

    if (!response.ok) {
      if (response.status == 401) {
        setLoginError(true);
      } else {
        setServerError(true); // TODO: display error in DOM
      }
      setModalIsLoading(false);
      return;
    }

    const data = await response.json();

    Cookies.set("accessToken", data.access);
    Cookies.set("refreshToken", data.refresh);

    onLoginSuccess();

    router.push("/");
  };

  const emailMessage = {
    id: "email",
    defaultMessage: "E-mail",
  };
  const passwordMessage = {
    id: "password",
    defaultMessage: "Password",
  };

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
        <FormattedMessage
          id="welcomeToPinIt"
          defaultMessage={"Welcome to PinIt!"}
        />
      </h1>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            labelMessage={emailMessage}
            placeholderMessage={emailMessage}
            name="email"
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
            labelMessage={passwordMessage}
            placeholderMessage={passwordMessage}
            name="password"
            type="password"
            value={credentials.password}
            errorMessageId={showFormErrors ? formErrors.password : ""}
            onChange={handleInputChange}
            withPasswordShowIcon={true}
          />
        </div>
        {loginError && (
          <div>Incorrect email or password. Please try again.</div>
        )}
        <button type="submit" className={styles.submitButton}>
          <FormattedMessage id="SIGN_IN" />
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
