import { useIntl } from "react-intl";
import Image from "next/image";
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
      <div className={styles.logoContainer}>
        <Image src="/images/logo.svg" alt="PinIt logo" width={32} height={32} />
        <h1 className={styles.logoHeader}>PinIt</h1>
      </div>
      <button className={styles.signInButton} onClick={handleClickSignInButton}>
        {intl.formatMessage({ id: "SIGN_IN" })}
      </button>
    </div>
  );
};

export default HeaderNotLoggedIn;
