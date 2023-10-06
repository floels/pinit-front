"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import styles from "./HomePageContentClient.module.css";
import PinSuggestion, { PinSuggestionType } from "./PinSuggestion";
import { getPinSuggestionsWithCamelizedKeys } from "@/lib/utils/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

type HomePageContentClientProps = {
  initialPinSuggestions: PinSuggestionType[];
  labels: {
    commons: { [key: string]: any };
    component: { [key: string]: any };
  };
  errorCode?: string;
};

const HomePageContentClient = ({
  initialPinSuggestions,
  labels,
  errorCode,
}: HomePageContentClientProps) => {
  const scrolledToBottomSentinel = useRef(null);

  const [currentEndpointPage, setCurrentEndpointPage] = useState(1);
  const [pinSuggestions, setPinSuggestions] = useState(initialPinSuggestions);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchPinSuggestionsFailed, setFetchPinSuggestionsFailed] =
    useState(false);

  // Fetch next page of pin suggestions when user scrolled to the bottom of the screen
  const updateStateWithNewPinSuggestionsResponse = async (
    newPinSuggestionsResponse: Response,
  ) => {
    const newPinSuggestionsResponseData =
      await newPinSuggestionsResponse.json();

    const newPinSuggestions = getPinSuggestionsWithCamelizedKeys(
      newPinSuggestionsResponseData,
    );

    setPinSuggestions((existingPinSuggestions) => [
      ...existingPinSuggestions,
      ...newPinSuggestions,
    ]);

    setCurrentEndpointPage((currentEndpointPage) => currentEndpointPage + 1);
  };

  const fetchNextPinSuggestions = useCallback(async () => {
    const nextEndpointPage = currentEndpointPage + 1;

    setIsFetching(true);

    const newPinSuggestionsResponse = await fetch(
      `/api/pins/suggestions?page=${nextEndpointPage}`,
      { method: "GET" },
    );

    setIsFetching(false);

    if (!newPinSuggestionsResponse.ok) {
      setFetchPinSuggestionsFailed(true);
      return;
    }

    setFetchPinSuggestionsFailed(false);

    await updateStateWithNewPinSuggestionsResponse(newPinSuggestionsResponse);
  }, [currentEndpointPage]);

  const fetchNextPinSuggestionsAndFallBack = useCallback(async () => {
    try {
      await fetchNextPinSuggestions();
    } catch (error) {
      toast.warn(labels.commons.CONNECTION_ERROR);
      setIsFetching(false);
    }
  }, [fetchNextPinSuggestions, labels]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPinSuggestionsAndFallBack();
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
  }, [fetchNextPinSuggestionsAndFallBack]);

  return (
    <main className={styles.container}>
      {pinSuggestions.length > 0 && (
        <div className={styles.grid} data-testid="pin-suggestions-container">
          {pinSuggestions.map((pinSuggestion) => (
            <div className={styles.pinSuggestion} key={pinSuggestion.id}>
              <PinSuggestion pinSuggestion={pinSuggestion} labels={labels} />
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
      {(errorCode || fetchPinSuggestionsFailed) && (
        <div className={styles.errorMessage}>
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            size="xs"
            className={styles.errorMessageIcon}
          />
          {labels.component.ERROR_DISPLAY_PIN_SUGGESTIONS}
        </div>
      )}
    </main>
  );
};

export default HomePageContentClient;
