/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import styles from "./PinThumbnail.module.css";
import { PinType } from "@/lib/types";

type PinThumbnailProps = {
  pin: PinType;
  labels: { [key: string]: any };
};

const PinThumbnail = ({ pin, labels }: PinThumbnailProps) => {
  return (
    <div className={styles.container} data-testid="pin-thumbnail">
      {/* We don't use Next's Image component because we don't know the image's display height in advance. */}
      <Link href={`/pin/${pin.id}`}>
        <img
          alt={
            pin.title ? pin.title : `${labels.PIN_BY} ${pin.authorDisplayName}`
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
    </div>
  );
};

export default PinThumbnail;
