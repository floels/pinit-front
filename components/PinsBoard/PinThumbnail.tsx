/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./PinThumbnail.module.css";
import { BoardWithBasicDetails, PinWithAuthorDetails } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import SavePinFlyoutContainer from "./SavePinFlyoutContainer";
import { ellipsizeText } from "@/lib/utils/strings";

type PinThumbnailProps = {
  pin: PinWithAuthorDetails;
  isInFirstColumn: boolean;
  isInLastColumn: boolean;
  boards: BoardWithBasicDetails[];
  isHovered: boolean;
  isSaveFlyoutOpen: boolean;
  isSaving: boolean;
  indexBoardWhereJustSaved: number | null;
  handleMouseEnterImage: () => void;
  handleMouseLeaveImage: () => void;
  handleClickSave: (event: React.MouseEvent<HTMLButtonElement>) => void;
  getClickHandlerForBoard: ({
    boardIndex,
  }: {
    boardIndex: number;
  }) => () => void;
  handleClickOutOfSaveFlyout: () => void;
};

const AUTHOR_PROFILE_PICTURE_SIZE_PX = 32;

const PinThumbnail = ({
  pin,
  isInFirstColumn,
  isInLastColumn,
  boards,
  isHovered,
  isSaveFlyoutOpen,
  isSaving,
  indexBoardWhereJustSaved,
  handleMouseEnterImage,
  handleMouseLeaveImage,
  handleClickSave,
  getClickHandlerForBoard,
  handleClickOutOfSaveFlyout,
}: PinThumbnailProps) => {
  const t = useTranslations("PinsBoard");

  const hasSaved = indexBoardWhereJustSaved !== null;

  let hoverOverlay;

  if (hasSaved) {
    const boardName = boards[indexBoardWhereJustSaved].name;

    const boardNameShort = ellipsizeText({
      text: boardName,
      maxLength: 20,
    });

    hoverOverlay = (
      <div className={styles.hoverOverlay}>
        <div className={styles.hoverOverlayContentSaved}>
          <span className={styles.boardTitle}>{boardNameShort}</span>
          <span className={styles.savedLabel}>
            {t("PIN_THUMBNAIL_SAVED_LABEL_TEXT")}
          </span>
        </div>
      </div>
    );
  } else {
    hoverOverlay = (
      <div className={styles.hoverOverlay}>
        <div className={styles.hoverOverlayContentNotSaved}>
          <button
            className={styles.saveButton}
            onClick={handleClickSave}
            data-testid="pin-thumbnail-save-button"
          >
            <span className={styles.saveButtonText}>
              {t("PIN_THUMBNAIL_SAVE_BUTTON_TEXT")}
            </span>
            <FontAwesomeIcon icon={faAngleDown} size="lg" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="pin-thumbnail">
      <Link
        href={`/pin/${pin.id}/`}
        className={styles.imageContainer}
        onMouseEnter={handleMouseEnterImage}
        onMouseLeave={handleMouseLeaveImage}
        data-testid="pin-thumbnail-image"
      >
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
        href={`/${pin.authorUsername}/`}
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
        <SavePinFlyoutContainer
          isInFirstColumn={isInFirstColumn}
          isInLastColumn={isInLastColumn}
          boards={boards}
          isSaving={isSaving}
          getClickHandlerForBoard={getClickHandlerForBoard}
          handleClickOutOfSaveFlyout={handleClickOutOfSaveFlyout}
        />
      )}
    </div>
  );
};

export default PinThumbnail;
