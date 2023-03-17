import { useIntl } from "react-intl";
import styles from "./HeaderNotLoggedIn.module.css";

type HeaderNotLoggedInProps = {
  handleClickSignInButton: () => void;
};

const HeaderNotLoggedIn = ({
  handleClickSignInButton,
}: HeaderNotLoggedInProps) => {
  const intl = useIntl();

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}></div>
      <button className={styles.signInButton} onClick={handleClickSignInButton}>
        {intl.formatMessage({ id: "SIGN_IN" })}
      </button>
    </div>
  );
};

export default HeaderNotLoggedIn;
