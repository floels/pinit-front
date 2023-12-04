import Image from "next/image";
import { useTranslations } from "next-intl";
import TextAndExploreButton from "./TextAndExploreButton";
import styles from "./ThirdFold.module.css";

type ThirdFoldProps = {
  handleClickExploreButton: () => void;
};

const ThirdFold = ({ handleClickExploreButton }: ThirdFoldProps) => {
  const textAndLinkColors = {
    primary: "--color-teal",
    secondary: "--color-green-minty",
  };

  const t = useTranslations("LandingPageContent");

  const textAndLinkLabels = {
    header: t("ThirdFold.HEADER"),
    paragraph: t("ThirdFold.PARAGRAPH"),
    link: t("ThirdFold.LINK"),
  };

  return (
    <div className={styles.container} data-testid="landing-page-third-fold">
      <div className={styles.textArea}>
        <TextAndExploreButton
          labels={textAndLinkLabels}
          colors={textAndLinkColors}
          handleClickExploreButton={handleClickExploreButton}
        />
      </div>
      <div className={styles.picturesArea}>
        <div className={styles.picturesContainer}>
          <div className={styles.pictureTopLeftContainer}>
            <Image
              src="https://s.pinimg.com/webapp/future-home-vibes-55a673b9.png"
              alt={t("ThirdFold.FUTURE_HOME_VIBES")}
              fill
              sizes="4OOpx"
              className={styles.mainPicture}
            />
            <div
              className={`${styles.pictureOverlay} ${styles.topLeftPictureOverlay}`}
            >
              <div
                className={`${styles.pictureOverlayText} ${styles.topLeftPictureOverlayText}`}
              >
                {t("ThirdFold.FUTURE_HOME_VIBES")}
              </div>
              <div className={styles.smallPicturesContainer}>
                <Image
                  src="https://s.pinimg.com/webapp/future-home1-f4037b6b.png"
                  alt={t("ThirdFold.FUTURE_HOME_VIBES")}
                  width={90}
                  height={130}
                  className={styles.smallPicture}
                />
                <Image
                  src="https://s.pinimg.com/webapp/future-home2-c70a8738.png"
                  alt={t("ThirdFold.FUTURE_HOME_VIBES")}
                  width={90}
                  height={130}
                  className={styles.smallPicture}
                />
                <Image
                  src="https://s.pinimg.com/webapp/future-home3-ac09e50f.png"
                  alt={t("ThirdFold.FUTURE_HOME_VIBES")}
                  width={90}
                  height={130}
                  className={styles.smallPicture}
                />
              </div>
            </div>
          </div>
          <div className={styles.pictureTopRightContainer}>
            <Image
              src="https://s.pinimg.com/webapp/scandinavian-bedroom-917ad89c.png"
              alt={t("ThirdFold.SCANDINAVIAN_BEDROOM")}
              fill
              sizes="220px"
              className={styles.mainPicture}
            />
            <div
              className={`${styles.pictureOverlay} ${styles.topRightPictureOverlay}`}
            >
              <div
                className={`${styles.pictureOverlayText} ${styles.topRightPictureOverlayText}`}
              >
                {t("ThirdFold.SCANDINAVIAN_BEDROOM")}
              </div>
            </div>
          </div>
          <div className={styles.pictureMiddleRightContainer}>
            <Image
              src="https://s.pinimg.com/webapp/deck-of-dreams-fb527bf1.png"
              alt={t("ThirdFold.DECK_OF_MY_DREAMS")}
              fill
              sizes="160px"
              className={styles.mainPicture}
            />
            <div
              className={`${styles.pictureOverlay} ${styles.middleRightPictureOverlay}`}
            >
              <div
                className={`${styles.pictureOverlayText} ${styles.middleRightPictureOverlayText}`}
              >
                {t("ThirdFold.DECK_OF_MY_DREAMS")}
              </div>
            </div>
          </div>
          <div className={styles.pictureBottomLeftContainer}>
            <Image
              src="https://s.pinimg.com/webapp/serve-my-drinks-263547ea.png"
              alt={t("ThirdFold.SERVE_DRINKS")}
              fill
              sizes="220px"
              className={styles.mainPicture}
            />
            <div
              className={`${styles.pictureOverlay} ${styles.bottomLeftPictureOverlay}`}
            >
              <div
                className={`${styles.pictureOverlayText} ${styles.bottomLeftPictureOverlayText}`}
              >
                {t("ThirdFold.SERVE_DRINKS")}
              </div>
            </div>
          </div>
          <div className={styles.pictureBottomRightContainer}>
            <Image
              src="https://s.pinimg.com/webapp/bathroom-upgrade-48ebb8fc.png"
              alt={t("ThirdFold.BATHROOM_UPGRADE")}
              fill
              sizes="220px"
              className={styles.mainPicture}
            />
            <div
              className={`${styles.pictureOverlay} ${styles.bottomRightPictureOverlay}`}
            >
              <div
                className={`${styles.pictureOverlayText} ${styles.bottomRightPictureOverlayText}`}
              >
                {t("ThirdFold.BATHROOM_UPGRADE")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdFold;
