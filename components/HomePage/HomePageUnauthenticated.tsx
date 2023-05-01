"use client";

import _ from "lodash";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PictureSlider from "./PictureSlider";
import HeaderUnauthenticated from "../Header/HeaderUnauthenticated";
import styles from "./HomePageUnauthenticated.module.css";
import { URL_S3_BUCKET } from "@/lib/constants";

type HomePageUnauthenticatedProps = {
  labels: { [key: string]: string };
}

const NUMBER_FOLDS = 2;

const HomePageUnauthenticated = ({ labels }: HomePageUnauthenticatedProps) => {
  const [currentFold, setCurrentFold] = useState(1);

  const handleMouseWheel = (event: WheelEvent) => {
    let newFold = currentFold;

    if (event.deltaY > 0 && currentFold !== NUMBER_FOLDS) {
      newFold = currentFold + 1;
    } else if (event.deltaY < 0 && currentFold > 1) {
      newFold = currentFold - 1;
    }

    if (newFold !== currentFold) {
      setCurrentFold(newFold);
    }
  };

  const handleClickSeeBelow = () => {
    setCurrentFold(2); // i.e. move down from picture slider to search section
  };

  useEffect(() => {
    document.addEventListener("wheel", handleMouseWheel);

    return () => {
      document.removeEventListener("wheel", handleMouseWheel);
    };
  });

  return (
    <main className={styles.container}>
      <div
        className={styles.content}
        style={{ transform: `translateY(-${(currentFold - 1) * 100}vh)` }}
        data-testid="homepage-unauthenticated-content"
      >
        <div className={styles.hero}>
          <HeaderUnauthenticated labels={_.pick(labels, ["LOG_IN", "SIGN_UP"])} />
          <div className={styles.pictureSlider}>
            <PictureSlider onClickSeeBelow={handleClickSeeBelow} labels={_.pick(labels, ["GET_YOUR_NEXT", "HOW_IT_WORKS", "HEADER_FOOD", "HEADER_HOME", "HEADER_OUTFIT", "HEADER_GARDENING"])} />
          </div>
        </div>
        <div className={styles.sectionSearch}>
          <div className={styles.sectionSearchPicturesArea}>
            <div className={styles.sectionSearchPicturesContainer}>
              <div className={styles.sectionSearchPictureLeftContainer}>
                <Image
                  src={`${URL_S3_BUCKET}/homepage/second_fold_left.jpg`}
                  alt="chicken-plate"
                  fill
                  sizes="204px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureTopRightContainer}>
                <Image
                  src={`${URL_S3_BUCKET}/homepage/second_fold_top_right.jpg`}
                  alt="chicken-plate"
                  fill
                  sizes="178px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureBottomRightContainer}>
                <Image
                  src={`${URL_S3_BUCKET}/homepage/second_fold_bottom_right.jpg`}
                  alt="chicken-plate"
                  fill
                  sizes="164px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <div className={styles.sectionSearchPictureCenterContainer}>
                <Image
                  src={`${URL_S3_BUCKET}/homepage/second_fold_center.jpg`}
                  alt="chicken-plate"
                  fill
                  sizes="298px"
                  className={styles.sectionSearchPicture}
                />
              </div>
              <a href="#" className={styles.searchBarLink}>
                <FontAwesomeIcon
                  icon={faSearch}
                  className={styles.searchBarLinkIcon}
                />
                {labels.EASY_CHICKEN_DINNER}
              </a>
            </div>
          </div>
          <div className={styles.sectionSearchTextArea}>
            <div className={styles.sectionSearchTextContainer}>
              <div className={styles.sectionSearchHeader}>
                {labels.SEARCH_FOR_AN_IDEA}
              </div>
              <div className={styles.sectionSearchParagraph}>
                {labels.WHAT_DO_YOU_WANT_TO_TRY_NEXT}
              </div>
              <a href="#" className={styles.exploreLink}>
                {labels.EXPLORE}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePageUnauthenticated;
