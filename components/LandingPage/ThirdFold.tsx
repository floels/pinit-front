import Image from "next/image";
import TextAndExploreButton from "./TextAndExploreButton";
import styles from "./ThirdFold.module.css";

type ThirdFoldProps = {
  labels: { [key: string]: any };
  handleClickExploreButton: () => void;
};

const ThirdFold = ({ labels, handleClickExploreButton }: ThirdFoldProps) => {
  const textAndLinkLabels = {
    header: labels.HEADER,
    paragraph: labels.PARAGRAPH,
    link: labels.LINK,
  };

  const textAndLinkColors = {
    primary: "--color-teal",
    secondary: "--color-green-minty",
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
              alt={labels.FUTURE_HOME_VIBES}
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
                {labels.FUTURE_HOME_VIBES}
              </div>
              <div className={styles.smallPicturesContainer}>
                <Image
                  src="https://s.pinimg.com/webapp/future-home1-f4037b6b.png"
                  alt={labels.FUTURE_HOME_VIBES}
                  width={90}
                  height={130}
                  className={styles.smallPicture}
                />
                <Image
                  src="https://s.pinimg.com/webapp/future-home2-c70a8738.png"
                  alt={labels.FUTURE_HOME_VIBES}
                  width={90}
                  height={130}
                  className={styles.smallPicture}
                />
                <Image
                  src="https://s.pinimg.com/webapp/future-home3-ac09e50f.png"
                  alt={labels.FUTURE_HOME_VIBES}
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
              alt={labels.SCANDINAVIAN_BEDROOM}
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
                {labels.SCANDINAVIAN_BEDROOM}
              </div>
            </div>
          </div>
          <div className={styles.pictureMiddleRightContainer}>
            <Image
              src="https://s.pinimg.com/webapp/deck-of-dreams-fb527bf1.png"
              alt={labels.DECK_OF_MY_DREAMS}
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
                {labels.DECK_OF_MY_DREAMS}
              </div>
            </div>
          </div>
          <div className={styles.pictureBottomLeftContainer}>
            <Image
              src="https://s.pinimg.com/webapp/serve-my-drinks-263547ea.png"
              alt={labels.SERVE_DRINKS}
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
                {labels.SERVE_DRINKS}
              </div>
            </div>
          </div>
          <div className={styles.pictureBottomRightContainer}>
            <Image
              src="https://s.pinimg.com/webapp/bathroom-upgrade-48ebb8fc.png"
              alt={labels.BATHROOM_UPGRADE}
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
                {labels.BATHROOM_UPGRADE}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdFold;
