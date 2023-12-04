import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./FourthFold.module.css";
import TextAndExploreButton from "./TextAndExploreButton";

type FourthFoldProps = {
  handleClickExploreButton: () => void;
};

const FourthFold = ({ handleClickExploreButton }: FourthFoldProps) => {
  const textAndLinkColors = {
    primary: "--color-red-fiery",
    secondary: "--color-pink",
  };

  const t = useTranslations("LandingPageContent");

  const textAndLinkLabels = {
    header: t("FourthFold.HEADER"),
    paragraph: t("FourthFold.PARAGRAPH"),
    link: t("FourthFold.LINK"),
  };

  return (
    <div className={styles.container} data-testid="landing-page-fourth-fold">
      <div className={styles.picturesArea}>
        <Image
          src="https://s.pinimg.com/webapp/shop-bd0c8a04.png"
          alt={t("FourthFold.LIP_SHADE_PICTURE_ALT")}
          fill
          sizes="50vw"
          className={styles.coverPicture}
        />
        <div className={styles.picturesOverlay}>
          <Image
            src="https://s.pinimg.com/webapp/creator-pin-img-491ebb56.png"
            alt={t("FourthFold.EYE_SHADE_PICTURE_ALT")}
            width={216}
            height={384}
            className={styles.secondaryPicture}
          />
          <Image
            src="https://s.pinimg.com/webapp/creator-avatar-d7a05622.png"
            alt={t("FourthFold.CREATOR_THUMBNAIL_PICTURE")}
            width={96}
            height={96}
            className={styles.thumbnailPicture}
          />
          <div className={styles.secondaryPictureText}>
            <span className={styles.secondaryPictureTextTitle}>
              {t("FourthFold.SECONDARY_PICTURE_TEXT_TITLE")}
            </span>
            <span className={styles.secondaryPictureTextSubtitle}>
              {t("FourthFold.SECONDARY_PICTURE_TEXT_SUBTITLE")}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.textArea}>
        <TextAndExploreButton
          labels={textAndLinkLabels}
          colors={textAndLinkColors}
          handleClickExploreButton={handleClickExploreButton}
        />
      </div>
    </div>
  );
};

export default FourthFold;
