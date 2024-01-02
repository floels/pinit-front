/* eslint-disable @next/next/no-img-element */

// Component structure is inspired by https://react-dropzone.js.org/ (see 'Usage' section)

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./PinImageDropzone.module.css";

type PinImageDropzoneProps = {
  imagePreviewURL: string | null;
  onFileDropped: (file: File) => void;
  onClickDeleteImage: () => void;
};

const PinImageDropzone = ({
  imagePreviewURL,
  onFileDropped,
  onClickDeleteImage,
}: PinImageDropzoneProps) => {
  const t = useTranslations("PinCreation");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Consider only first file from `acceptedFiles` array
      if (acceptedFiles[0]) {
        onFileDropped(acceptedFiles[0]);
      }
    },
    [onFileDropped],
  );

  const dropzone = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/jpeg": [], "image/png": [] },
  });

  const { getRootProps, getInputProps } = dropzone;

  if (imagePreviewURL) {
    return (
      <div className={styles.imagePreviewContainer}>
        <img
          src={imagePreviewURL}
          alt={t("ALT_IMAGE_PREVIEW")}
          className={styles.imagePreview}
        />
        <div
          className={styles.deleteIconContainer}
          onClick={onClickDeleteImage}
          data-testid="pin-image-dropzone-delete-image-button"
        >
          <FontAwesomeIcon icon={faTrash} size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={styles.dropzone}
      data-testid="pin-image-dropzone"
    >
      <input {...getInputProps()} />
      <div className={styles.dropzoneIconAndInstruction}>
        <FontAwesomeIcon icon={faCircleArrowUp} size="2x" />
        <p className={styles.dropzoneInstruction}>
          {t("DROPZONE_INSTRUCTION")}
        </p>
      </div>
      <p className={styles.acceptedFilesInstruction}>
        {t("DROPZONE_ACCEPTED_FILES")}
      </p>
    </div>
  );
};

export default PinImageDropzone;
