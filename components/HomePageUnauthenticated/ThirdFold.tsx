import Image from "next/image";
import TextAndLink from "./TextAndLink";
import styles from "./ThirdFold.module.css";

type ThirdFoldProps = {
  labels: { [key: string]: any };
};

const ThirdFold = ({ labels }: ThirdFoldProps) => {
  const textAndLinkLabels = {
    header: labels.SAVE_IDEAS,
    paragraph: labels.COLLECT_FAVORITES,
    link: labels.EXPLORE,
  };

  const textAndLinkColors = {
    primary: "--color-teal",
    secondary: "--color-green-minty",
  };

  return (
    <div className={styles.container}>
      <div className={styles.textArea}>
        <TextAndLink
          labels={textAndLinkLabels}
          linkTarget="#"
          colors={textAndLinkColors}
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
            </div>
            <div className={styles.smallPicturesContainer}></div>
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
