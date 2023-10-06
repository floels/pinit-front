import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styles from "./PinsBoardLoadingState.module.css";

const PinsBoardLoadingState = () => {
  return (
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={faSpinner}
        size="2x"
        spin
        className={styles.loadingSpinner}
        data-testid="loading-spinner"
      />
    </div>
  );
};

export default PinsBoardLoadingState;
