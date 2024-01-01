import { FOLDS_ENUM } from "./LandingPageContent";
import styles from "./TextAndExploreButton.module.css";

type TextAndExploreButtonProps = {
  foldNumber: FOLDS_ENUM;
  labels: { [key: string]: string };
};

const computeContainerClasses = ({
  foldNumber,
}: {
  foldNumber: FOLDS_ENUM;
}) => {
  if (foldNumber === FOLDS_ENUM.SECOND) {
    return `${styles.container} ${styles.containerSecondFold}`;
  }
  if (foldNumber === FOLDS_ENUM.THIRD) {
    return `${styles.container} ${styles.containerThirdFold}`;
  }
  if (foldNumber === FOLDS_ENUM.FOURTH) {
    return `${styles.container} ${styles.containerFourthFold}`;
  }
};

const computeButtonClasses = ({ foldNumber }: { foldNumber: FOLDS_ENUM }) => {
  if (foldNumber === FOLDS_ENUM.SECOND) {
    return `${styles.button} ${styles.buttonSecondFold}`;
  }
  if (foldNumber === FOLDS_ENUM.THIRD) {
    return `${styles.button} ${styles.buttonThirdFold}`;
  }
  if (foldNumber === FOLDS_ENUM.FOURTH) {
    return `${styles.button} ${styles.buttonFourthFold}`;
  }
};

const TextAndExploreButton = ({
  foldNumber,
  labels,
}: TextAndExploreButtonProps) => {
  const containerClasses = computeContainerClasses({ foldNumber });

  const buttonClasses = computeButtonClasses({ foldNumber });

  return (
    <div className={containerClasses}>
      <div className={styles.header}>{labels.header}</div>
      <div className={styles.paragraph}>{labels.paragraph}</div>
      <button className={buttonClasses}>{labels.link}</button>
    </div>
  );
};

export default TextAndExploreButton;
