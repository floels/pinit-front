import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import styles from "./ErrorView.module.css";

type ErrorViewProps = {
  errorMessageKey: string;
};

const ErrorView = ({ errorMessageKey }: ErrorViewProps) => {
  const t = useTranslations();

  return (
    <div className={styles.container}>
      <FontAwesomeIcon icon={faWarning} className={styles.icon} />
      {t(errorMessageKey)}
    </div>
  );
};

export default ErrorView;
