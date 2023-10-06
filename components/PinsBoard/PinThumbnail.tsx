/* eslint-disable @next/next/no-img-element */

import styles from "./PinThumbnail.module.css";

export type PinThumbnailType = {
  id: string;
  title: string;
  imageURL: string;
  authorUsername: string;
  authorDisplayName: string;
};

type PinThumbnailProps = {
  pinThumbnail: PinThumbnailType;
  labels: { [key: string]: any };
};

const PinThumbnail = ({ pinThumbnail, labels }: PinThumbnailProps) => {
  return (
    <div className={styles.container} data-testid="pin-thumbnail">
      {/* We don't use Next's Image component because we don't know the image's display height in advance. */}
      <img
        alt={
          pinThumbnail.title
            ? pinThumbnail.title
            : `${labels.PIN_BY} ${pinThumbnail.authorDisplayName}`
        }
        src={pinThumbnail.imageURL}
        className={styles.image}
      />
      {pinThumbnail.title && (
        <div className={styles.title}>{pinThumbnail.title}</div>
      )}
    </div>
  );
};

export default PinThumbnail;
