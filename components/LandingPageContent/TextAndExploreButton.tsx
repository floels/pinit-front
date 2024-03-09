import Link from "next/link";
import { FOLD } from "./LandingPageContent";
import styles from "./TextAndExploreButton.module.css";
import { useTranslations } from "next-intl";

type TextAndExploreButtonProps = {
  foldNumber: FOLD;
  linkTarget: string;
  labels: { [key: string]: string };
};

const computeContainerClasses = ({ foldNumber }: { foldNumber: FOLD }) => {
  if (foldNumber === FOLD.SECOND) {
    return `${styles.container} ${styles.containerSecondFold}`;
  }
  if (foldNumber === FOLD.THIRD) {
    return `${styles.container} ${styles.containerThirdFold}`;
  }
  if (foldNumber === FOLD.FOURTH) {
    return `${styles.container} ${styles.containerFourthFold}`;
  }
};

const computeButtonClasses = ({ foldNumber }: { foldNumber: FOLD }) => {
  if (foldNumber === FOLD.SECOND) {
    return `${styles.button} ${styles.buttonSecondFold}`;
  }
  if (foldNumber === FOLD.THIRD) {
    return `${styles.button} ${styles.buttonThirdFold}`;
  }
  if (foldNumber === FOLD.FOURTH) {
    return `${styles.button} ${styles.buttonFourthFold}`;
  }
};

const TextAndExploreButton = ({
  foldNumber,
  linkTarget,
  labels,
}: TextAndExploreButtonProps) => {
  const t = useTranslations("LandingPageContent");

  const containerClasses = computeContainerClasses({ foldNumber });

  const buttonClasses = computeButtonClasses({ foldNumber });

  return (
    <div
      className={containerClasses}
      data-testid="text-and-explore-button-container"
    >
      <div className={styles.header}>{labels.header}</div>
      <div className={styles.paragraph}>{labels.paragraph}</div>
      <Link
        href={linkTarget}
        className={buttonClasses}
        data-testid="text-and-explore-button-button"
      >
        {t("Common.EXPLORE_LINK")}
      </Link>
    </div>
  );
};

export default TextAndExploreButton;
