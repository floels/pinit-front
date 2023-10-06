"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import styles from "./PinsBoardClient.module.css";
import PinThumbnail, { PinThumbnailType } from "./PinThumbnail";
import { getPinThumbnailsWithCamelizedKeys } from "@/lib/utils/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

type PinsBoardClientProps = {
  initialPinThumbnails: PinThumbnailType[];
  labels: {
    commons: { [key: string]: any };
    component: { [key: string]: any };
  };
  errorCode?: string;
};

const PinsBoardClient = ({
  initialPinThumbnails,
  labels,
  errorCode,
}: PinsBoardClientProps) => {
  const scrolledToBottomSentinel = useRef(null);

  const [currentEndpointPage, setCurrentEndpointPage] = useState(1);
  const [pinThumbnails, setPinThumbnails] = useState(initialPinThumbnails);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);

  // Fetch next page of pin thumbnails when user scrolled to the bottom of the screen
  const updateStateWithNewPinThumbnailsResponse = async (
    newPinThumbnailsResponse: Response,
  ) => {
    const newPinThumbnailsResponseData = await newPinThumbnailsResponse.json();

    const newPinThumbnails = getPinThumbnailsWithCamelizedKeys(
      newPinThumbnailsResponseData,
    );

    setPinThumbnails((existingPinThumbnails) => [
      ...existingPinThumbnails,
      ...newPinThumbnails,
    ]);

    setCurrentEndpointPage((currentEndpointPage) => currentEndpointPage + 1);
  };

  const fetchNextPinThumbnails = useCallback(async () => {
    const nextEndpointPage = currentEndpointPage + 1;

    setIsFetching(true);

    const newPinThumbnailsResponse = await fetch(
      `/api/pins/suggestions?page=${nextEndpointPage}`,
      { method: "GET" },
    );

    setIsFetching(false);

    if (!newPinThumbnailsResponse.ok) {
      setFetchFailed(true);
      return;
    }

    setFetchFailed(false);

    await updateStateWithNewPinThumbnailsResponse(newPinThumbnailsResponse);
  }, [currentEndpointPage]);

  const fetchNextPinThumbnailsAndFallBack = useCallback(async () => {
    try {
      await fetchNextPinThumbnails();
    } catch (error) {
      toast.warn(labels.commons.CONNECTION_ERROR);
      setIsFetching(false);
    }
  }, [fetchNextPinThumbnails, labels]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPinThumbnailsAndFallBack();
        }
      },
      { threshold: 1.0 },
    );

    if (scrolledToBottomSentinel.current) {
      observer.observe(scrolledToBottomSentinel.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPinThumbnailsAndFallBack]);

  return (
    <main className={styles.container}>
      {pinThumbnails.length > 0 && (
        <div className={styles.grid}>
          {pinThumbnails.map((pinThumbnail) => (
            <div className={styles.pinThumbnail} key={pinThumbnail.id}>
              <PinThumbnail
                pinThumbnail={pinThumbnail}
                labels={labels.component.PinsBoard}
              />
            </div>
          ))}
          <div ref={scrolledToBottomSentinel}></div>
        </div>
      )}
      {isFetching && (
        <div className={styles.loadingIconContainer}>
          <FontAwesomeIcon
            icon={faSpinner}
            size="2x"
            spin
            className={styles.loadingSpinner}
            data-testid="loading-spinner"
          />
        </div>
      )}
      {(errorCode || fetchFailed) && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="xs"
            className={styles.errorMessageIcon}
          />
          {labels.component.ERROR_DISPLAY_PINS}
        </div>
      )}
    </main>
  );
};

export default PinsBoardClient;
