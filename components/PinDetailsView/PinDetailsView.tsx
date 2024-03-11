/* eslint-disable @next/next/no-img-element */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { PinWithFullDetails } from "@/lib/types";
import styles from "./PinDetailsView.module.css";

type PinDetailsViewProps = {
  pin: PinWithFullDetails;
};

const AUTHOR_PROFILE_PICTURE_SIZE_PX = 48;

const PinDetailsView = ({ pin }: PinDetailsViewProps) => {
  const t = useTranslations("PinDetails");

  return (
    <div className={styles.container}>
      <Link href="/">
        <button className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
      </Link>
      <div className={styles.pinViewContainer} data-testid="pin-view-container">
        {/* We don't use Next's Image component because we don't know the image's display height in advance. */}
        <img
          src={pin.imageURL}
          alt={
            pin.title
              ? pin.title
              : `${t("ALT_PIN_BY")} ${pin.authorDisplayName}`
          }
          className={styles.image}
        />
        <div className={styles.pinInformation}>
          <h1 className={styles.pinTitle}>{pin.title}</h1>
          {pin.description && (
            <p className={styles.pinDescription}>{pin.description}</p>
          )}
          <Link
            href={`/${pin.authorUsername}/`}
            className={styles.authorDetails}
            data-testid="pin-author-details"
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
      </div>
    </div>
  );
};

export default PinDetailsView;
