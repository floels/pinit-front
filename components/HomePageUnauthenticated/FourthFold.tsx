import Image from "next/image";
import styles from "./FourthFold.module.css";
import TextAndLink from "./TextAndLink";

type FourthFoldProps = {
  labels: { [key: string]: any };
};

const FourthFold = ({ labels }: FourthFoldProps) => {
  const textAndLinkLabels = {
    header: labels.HEADER,
    paragraph: labels.PARAGRAPH,
    link: labels.LINK,
  };

  const textAndLinkColors = {
    primary: "--color-red-fiery",
    secondary: "--color-pink",
  };

  return (
    <div className={styles.container}>
      <div className={styles.picturesArea}>
        <Image
          src="https://s.pinimg.com/webapp/shop-bd0c8a04.png"
          alt={labels.LIP_SHADE_PICTURE_ALT}
          fill
          sizes="50vw"
          className={styles.coverPicture}
        />
        <div className={styles.picturesOverlay}>
          <Image
            src="https://s.pinimg.com/webapp/creator-pin-img-491ebb56.png"
            alt={labels.EYE_SHADE_PICTURE_ALT}
            width={216}
            height={384}
            className={styles.secondaryPicture}
          />
          <Image
            src="https://s.pinimg.com/webapp/creator-avatar-d7a05622.png"
            alt={labels.CREATOR_THUMBNAIL_PICTURE}
            width={96}
            height={96}
            className={styles.thumbnailPicture}
          />
          <div className={styles.secondaryPictureText}>
            <span className={styles.secondaryPictureTextTitle}>
              {labels.SECONDARY_PICTURE_TEXT_TITLE}
            </span>
            <span className={styles.secondaryPictureTextSubtitle}>
              {labels.SECONDARY_PICTURE_TEXT_SUBTITLE}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.textArea}>
        <TextAndLink
          labels={textAndLinkLabels}
          linkTarget="#"
          colors={textAndLinkColors}
        />
      </div>
    </div>
  );
};

export default FourthFold;
