import { FormattedMessage } from "react-intl";
import styles from "./HeaderNotLoggedIn.module.css";

type HeaderNotLoggedInProps = {
  handleClickSignInButton: () => void;
};

const HeaderNotLoggedIn = ({
  handleClickSignInButton,
}: HeaderNotLoggedInProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}></div>
      <button className={styles.signInButton} onClick={handleClickSignInButton}>
        <FormattedMessage id="signIn" defaultMessage="Sign in" />
      </button>
    </div>
  );
};

export default HeaderNotLoggedIn;
