import Link from "next/link";
import { FOLD } from "./LandingPageContent";
import styles from "./TextAndExploreButton.module.css";
import { useTranslations } from "next-intl";
import classNames from "classnames";

type TextAndExploreButtonProps = {
  foldNumber: FOLD;
  linkTarget: string;
  labels: { [key: string]: string };
};

const TextAndExploreButton = ({
  foldNumber,
  linkTarget,
  labels,
}: TextAndExploreButtonProps) => {
  const t = useTranslations("LandingPageContent");

  const containerClasses = classNames(styles.container, {
    [styles.containerSecondFold]: foldNumber === FOLD.SECOND,
    [styles.containerThirdFold]: foldNumber === FOLD.THIRD,
    [styles.containerFourthFold]: foldNumber === FOLD.FOURTH,
  });

  const buttonClasses = classNames(styles.button, {
    [styles.buttonSecondFold]: foldNumber === FOLD.SECOND,
    [styles.buttonThirdFold]: foldNumber === FOLD.THIRD,
    [styles.buttonFourthFold]: foldNumber === FOLD.FOURTH,
  });

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
