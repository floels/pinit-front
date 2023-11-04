/* eslint-disable @next/next/no-img-element */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { PinType } from "@/lib/types";
import { useTranslations } from "next-intl";
import { getTranslationsObject } from "@/lib/utils/i18n";
import styles from "./PinDetailsView.module.css";

type PinDetailsViewProps = {
  pin: PinType;
};

const PinDetailsView = ({ pin }: PinDetailsViewProps) => {
  const translator = useTranslations("PinDetails");
  const translations = getTranslationsObject("PinDetails", translator);

  return (
    <div className={styles.container}>
      <Link href="/">
        <button className={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
      </Link>
      <div className={styles.pinViewContainer}>
        <img
          src={pin.imageURL}
          alt={
            pin.title
              ? pin.title
              : `${translations.ALT_PIN_BY} ${pin.authorDisplayName}`
          }
          className={styles.image}
        />
        <div className={styles.pinInformation}>
          <h1 className={styles.pinTitle}>{pin.title}</h1>
          <p className={styles.pinDescription}>{pin.description}</p>
        </div>
      </div>
    </div>
  );
};

export default PinDetailsView;
