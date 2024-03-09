import Image from "next/image";
import Link from "next/link";
import { Board } from "@/lib/types";
import styles from "./BoardThumbnail.module.css";
import { useState } from "react";

type BoardThumbnailProps = {
  username: string;
  board: Board;
};

const COVER_PICTURE_SIZE_PX = 160;
const SECONDARY_PICTURE_SIZE_PX = 80;

const BoardThumbnail = ({ username, board }: BoardThumbnailProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { slug, name, firstImageURLs } = board;

  const coverImageURL = firstImageURLs.length > 0 ? firstImageURLs[0] : null;

  let coverImage;

  if (coverImageURL) {
    coverImage = (
      <Image
        src={coverImageURL}
        alt={name}
        width={COVER_PICTURE_SIZE_PX}
        height={COVER_PICTURE_SIZE_PX}
        className={styles.coverPicture}
      />
    );
  } else {
    coverImage = <div className={styles.coverPicturePlaceholder} />;
  }

  const SecondaryImage = ({ index }: { index: number }) => {
    const imageURL =
      firstImageURLs.length > index ? firstImageURLs[index] : null;

    if (imageURL) {
      const imageClasses = [
        styles.secondaryPicture,
        index === 1 ? styles.topSecondaryPicture : null,
      ];

      const imageHeight =
        index === 1 ? SECONDARY_PICTURE_SIZE_PX - 1 : SECONDARY_PICTURE_SIZE_PX;
      // to account for 1px bottom border

      return (
        <Image
          src={imageURL}
          alt={name}
          width={SECONDARY_PICTURE_SIZE_PX}
          height={imageHeight}
          className={imageClasses.join(" ")}
        />
      );
    }

    const placeholderClasses = [
      styles.secondaryPicturePlaceholder,
      index === 1 ? styles.topSecondaryPicturePlaceholder : null,
    ];

    return <div className={placeholderClasses.join(" ")} />;
  };

  return (
    <div className={styles.container}>
      <Link
        href={`/${username}/${slug}`}
        className={styles.content}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.imagesContainer}>
          {coverImage}
          <div className={styles.secondaryImages}>
            <SecondaryImage index={1} />
            <SecondaryImage index={2} />
          </div>
          {isHovered && <div className={styles.overlay} />}
        </div>
        <span className={styles.title}>{name}</span>
      </Link>
    </div>
  );
};

export default BoardThumbnail;
