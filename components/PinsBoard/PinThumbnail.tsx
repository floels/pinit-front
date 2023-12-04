/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./PinThumbnail.module.css";
import { PinType } from "@/lib/types";

type PinThumbnailProps = {
  pin: PinType;
};

const AUTHOR_PROFILE_PICTURE_SIZE_PX = 32;

const PinThumbnail = ({ pin }: PinThumbnailProps) => {
  const t = useTranslations("PinsBoard");

  const shouldDisplayAuthorDetails =
    !!pin.authorProfilePictureURL &&
    !!pin.authorDisplayName &&
    !!pin.authorUsername;

  return (
    <div className={styles.container} data-testid="pin-thumbnail">
      {/* We don't use Next's Image component because we don't know the image's display height in advance. */}
      <Link href={`/pin/${pin.id}`}>
        <img
          alt={
            pin.title
              ? pin.title
              : `${t("ALT_PIN_BY")} ${pin.authorDisplayName}`
          }
          src={pin.imageURL}
          className={styles.image}
        />
      </Link>
      {pin.title && (
        <Link href={`/pin/${pin.id}`} className={styles.title}>
          {pin.title}
        </Link>
      )}
      {shouldDisplayAuthorDetails && (
        <Link
          className={styles.authorDetails}
          data-testid="pin-author-details"
          href={`/${pin.authorUsername}`}
        >
          <Image
            className={styles.authorProfilePicture}
            width={AUTHOR_PROFILE_PICTURE_SIZE_PX}
            height={AUTHOR_PROFILE_PICTURE_SIZE_PX}
            src={pin.authorProfilePictureURL as string}
            alt={`${t("ALT_PROFILE_PICTURE_OF")} ${pin.authorDisplayName}`}
          />
          <span className={styles.authorName}>{pin.authorDisplayName}</span>
        </Link>
      )}
    </div>
  );
};

export default PinThumbnail;
