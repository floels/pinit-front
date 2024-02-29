/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./PinThumbnail.module.css";
import { Board, Pin } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import SavePinFlyout from "./SavePinFlyout";

type PinThumbnailProps = {
  pin: Pin;
  boards: Board[];
  isHovered: boolean;
  isSaveFlyoutOpen: boolean;
  isSaving: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleClickSave: (event: React.MouseEvent<HTMLButtonElement>) => void;
  getClickHandlerForBoard: ({
    boardIndex,
  }: {
    boardIndex: number;
  }) => () => void;
};

const AUTHOR_PROFILE_PICTURE_SIZE_PX = 32;

const PinThumbnail = ({
  pin,
  boards,
  isHovered,
  isSaveFlyoutOpen,
  isSaving,
  handleMouseEnter,
  handleMouseLeave,
  handleClickSave,
  getClickHandlerForBoard,
}: PinThumbnailProps) => {
  const t = useTranslations("PinsBoard");

  const hoverOverlay = (
    <div className={styles.hoverOverlay}>
      <button className={styles.saveButton} onClick={handleClickSave}>
        <span className={styles.saveButtonText}>
          {t("PIN_THUMBNAIL_SAVE_BUTTON_TEXT")}
        </span>
        <FontAwesomeIcon icon={faAngleDown} size="lg" />
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
      {isSaveFlyoutOpen && (
        <SavePinFlyout
          boards={boards}
          isSaving={isSaving}
          getClickHandlerForBoard={getClickHandlerForBoard}
        />
      )}
    </div>
  );
};

export default PinThumbnail;
