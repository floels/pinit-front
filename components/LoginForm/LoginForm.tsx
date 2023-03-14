import { API_BASE_URL, TOKEN_OBTAIN_ENDPOINT } from "@/lib/constants";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import LabelledTextInput from "../LabelledTextInput/LabelledTextInput";
import styles from "./LoginForm.module.css";
import { FormattedMessage } from "react-intl";

type LoginFormProps = {
  onLoginSuccess: () => void;
};

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [serverError, setServerError] = useState(false);

  const router = useRouter();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Reset login error state when user types into input field
    setLoginError(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      setFetchError(true); // TODO: display error in DOM
      return;
    }

    if (response.status == 401) {
      setLoginError(true);
    } else if (!response.ok) {
      setServerError(true); // TODO: display error in DOM
    } else {
      const data = await response.json();

      Cookies.set("accessToken", data.access);
      Cookies.set("refreshToken", data.refresh);

      onLoginSuccess();

      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.emailInputContainer}>
          <LabelledTextInput
            labelMessage={{
              id: "email",
              defaultMessage: "E-mail",
            }}
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.passwordInputContainer}>
          <LabelledTextInput
            labelMessage={{
              id: "password",
              defaultMessage: "Password",
            }}
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleInputChange}
            withPasswordShowIcon={true}
          />
        </div>
        {loginError && (
          <div>Incorrect email or password. Please try again.</div>
        )}
        <button type="submit" className={styles.submitButton}>
          <FormattedMessage id="signIn" defaultMessage="Sign in" />
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
