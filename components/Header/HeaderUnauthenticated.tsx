import { useIntl } from "react-intl";
import Image from "next/image";
import styles from "./HeaderUnauthenticated.module.css";

type HeaderUnauthenticatedProps = {
  handleClickLoginButton: () => void;
  handleClickSignUpButton: () => void;
};

const HeaderUnauthenticated = ({
  handleClickLoginButton,
  handleClickSignUpButton,
}: HeaderUnauthenticatedProps) => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <a href="/" className={styles.logoContainer}>
        <Image src="/images/logo.svg" alt="PinIt logo" width={32} height={32} />
        <h1 className={styles.logoHeader}>PinIt</h1>
      </a>
      <button className={styles.loginButton} onClick={handleClickLoginButton}>
        {intl.formatMessage({ id: "LOG_IN" })}
      </button>
      <button className={styles.signUpButton} onClick={handleClickSignUpButton}>
        {intl.formatMessage({ id: "SIGN_UP" })}
      </button>
    </div>
  );
};

export default HeaderUnauthenticated;
