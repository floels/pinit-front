import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import styles from "./SecondFold.module.css";
import TextAndExploreButton from "./TextAndExploreButton";
import { FOLDS_ENUM } from "./LandingPageContent";

const SecondFold = () => {
  const t = useTranslations("LandingPageContent");

  const textAndLinkLabels = {
    header: t("SecondFold.HEADER"),
    paragraph: t("SecondFold.PARAGRAPH"),
    link: t("SecondFold.LINK"),
  };

  return (
    <div className={styles.container} data-testid="landing-page-second-fold">
      <div className={styles.picturesArea}>
        <div className={styles.picturesContainer}>
          <div className={styles.pictureLeftContainer}>
            <Image
              src="https://s.pinimg.com/webapp/left-511a9304.png"
              alt={t("SecondFold.CHICKEN_PLATE")}
              fill
              sizes="204px"
              className={styles.picture}
            />
          </div>
          <div className={styles.pictureTopRightContainer}>
            <Image
              src="https://s.pinimg.com/webapp/topRight-d0230035.png"
              alt={t("SecondFold.CHICKEN_PLATE")}
              fill
              sizes="178px"
              className={styles.picture}
            />
          </div>
          <div className={styles.pictureBottomRightContainer}>
            <Image
              src="https://s.pinimg.com/webapp/right-88044782.png"
              alt={t("SecondFold.CHICKEN_PLATE")}
              fill
              sizes="164px"
              className={styles.picture}
            />
          </div>
          <div className={styles.pictureCenterContainer}>
            <Image
              src="https://s.pinimg.com/webapp/center-77497603.png"
              alt={t("SecondFold.CHICKEN_PLATE")}
              fill
              sizes="298px"
              className={styles.picture}
            />
          </div>
          <p className={styles.searchBarLink}>
            <FontAwesomeIcon
              icon={faSearch}
              className={styles.searchBarLinkIcon}
            />
            {t("SecondFold.EASY_CHICKEN_DINNER")}
          </p>
        </div>
      </div>
      <div className={styles.textArea}>
        <TextAndExploreButton
          foldNumber={FOLDS_ENUM.SECOND}
          labels={textAndLinkLabels}
        />
      </div>
    </div>
  );
};

export default SecondFold;
