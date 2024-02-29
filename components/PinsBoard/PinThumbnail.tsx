/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./PinThumbnail.module.css";
import { Board, Pin } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

type PinThumbnailProps = {
  pin: Pin;
  isHovered: boolean;
  boards: Board[];
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
};

const AUTHOR_PROFILE_PICTURE_SIZE_PX = 32;

const PinThumbnail = ({
  pin,
  isHovered,
  boards,
  handleMouseEnter,
  handleMouseLeave,
}: PinThumbnailProps) => {
  const t = useTranslations("PinsBoard");

  const shouldShowBoardsDropdownInHoverOverlay = boards.length > 0;

  const hoverOverlay = (
    <div className={styles.hoverOverlay}>
      {shouldShowBoardsDropdownInHoverOverlay && (
        <div className={styles.boardsDropdown}>
          <span className={styles.firstBoardTitle}>{boards[0].title}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      )}
      <button className={styles.saveButton}>
        {t("PIN_THUMBNAIL_SAVE_BUTTON_TEXT")}
      </button>
    </div>
  );

  return (
    <div
      className={styles.container}
      data-testid="pin-thumbnail"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/pin/${pin.id}`} className={styles.imageContainer}>
        {/* We don't use Next's Image component because we don't know the image's display height in advance. */}
        <img
          alt={
            pin.title
              ? pin.title
              : `${t("ALT_PIN_BY")} ${pin.authorDisplayName}`
          }
          src={pin.imageURL}
          className={styles.image}
        />
        {isHovered && hoverOverlay}
      </Link>
      {pin.title && (
        <Link href={`/pin/${pin.id}`} className={styles.title}>
          {pin.title}
        </Link>
      )}
      <Link
        className={styles.authorDetails}
        data-testid="pin-author-details"
        href={`/${pin.authorUsername}`}
      >
        {pin.authorProfilePictureURL && (
          <Image
            className={styles.authorProfilePicture}
            width={AUTHOR_PROFILE_PICTURE_SIZE_PX}
            height={AUTHOR_PROFILE_PICTURE_SIZE_PX}
            src={pin.authorProfilePictureURL}
            alt={`${t("ALT_PROFILE_PICTURE_OF")} ${pin.authorDisplayName}`}
          />
        )}
        <span className={styles.authorName}>{pin.authorDisplayName}</span>
      </Link>
    </div>
  );
};

export default PinThumbnail;
