"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useViewportWidth } from "@/lib/utils/custom-hooks";
import { ToastContainer, toast } from "react-toastify";
import styles from "./HomePageAuthenticatedClient.module.css";
import PinSuggestion, { PinSuggestionType } from "./PinSuggestion";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import { ENDPOINT_GET_PIN_SUGGESTIONS } from "@/lib/constants";
import { AccountType } from "@/app/[locale]/page";
import HeaderAuthenticatedClient from "../Header/HeaderAuthenticatedClient";
import { refreshAccessToken } from "@/lib/utils/authentication";

type HomePageAuthenticatedClientProps = {
  accounts: AccountType[];
  initialPinSuggestions: PinSuggestionType[];
  labels: {
    commons: { [key: string]: any };
    component: { [key: string]: any };
  };
};

const GRID_COLUMN_WIDTH_WITH_MARGINS_PX = 236 + 2 * 8; // each column has a set width of 236px and side margins of 8px

const getNumberOfColumns = (viewportWidth: number) => {
  const theoreticalNumberOfColumns = Math.floor(
    viewportWidth / GRID_COLUMN_WIDTH_WITH_MARGINS_PX
  );

  // We force the number of columns to be between 2 and 6:
  const boundedNumberOfColumns = Math.min(
    Math.max(theoreticalNumberOfColumns, 2),
    6
  );

  return boundedNumberOfColumns;
};

const HomePageAuthenticatedClient = ({
  accounts,
  initialPinSuggestions,
  labels,
}: HomePageAuthenticatedClientProps) => {
  const scrolledToBottomSentinel = useRef(null);

  const [currentEndpointPage, setCurrentEndpointPage] = useState(1);
  const [pinSuggestions, setPinSuggestions] = useState(initialPinSuggestions);

  const [numberOfColumns, setNumberOfColumns] = useState<number | undefined>();
  const viewportWidth = useViewportWidth();

  // Refresh access token after initial rendering:
  useEffect(() => {
    try {
      refreshAccessToken();
    } catch (error) {
      // Fail silently if refresh failed
    }
  }, []);

  // Fetch next page of pin suggestions when user scrolled to the bottom of the screen
  const updateStateWithNewPinSuggestionsResponse = async (
    newPinSuggestionsResponse: Response
  ) => {
    const newPinSuggestionsResponseData =
      await newPinSuggestionsResponse.json();

    setPinSuggestions((pinSuggestions) => [
      ...pinSuggestions,
      ...newPinSuggestionsResponseData.results,
    ]);
    setCurrentEndpointPage((currentEndpointPage) => currentEndpointPage + 1);
  };

  const fetchNextPinSuggestions = async () => {
    const nextEndpointPage = currentEndpointPage + 1;
    const accessToken = Cookies.get("accessToken") as string;

    const newPinSuggestionsResponse = await fetchWithAuthentication({
      endpoint: `${ENDPOINT_GET_PIN_SUGGESTIONS}?page=${nextEndpointPage}`,
      accessToken,
    });

    if (newPinSuggestionsResponse.ok) {
      await updateStateWithNewPinSuggestionsResponse(newPinSuggestionsResponse);
      return;
    }

    // KO response from the server: display a toast message
    toast.warn(labels.component.ERROR_FETCH_PIN_SUGGESTIONS);
  };

  const fetchNextPinSuggestionsAndFallBack = async () => {
    try {
      fetchNextPinSuggestions();
    } catch (error) {
      toast.warn(labels.commons.CONNECTION_ERROR);
    }
  };

  const cachedFetchNextPinSuggestionsAndFallBack = useCallback(
    fetchNextPinSuggestionsAndFallBack,
    [currentEndpointPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          cachedFetchNextPinSuggestionsAndFallBack();
        }
      },
      { threshold: 1.0 }
    );

    if (scrolledToBottomSentinel.current) {
      observer.observe(scrolledToBottomSentinel.current);
    }

    return () => {
      observer.disconnect();
    };
    // We need to add `numberOfColumns` as a dependency because it will be undefined on initial render
    // Only on second render will it be set and will the sentinel be present in the DOM
  }, [fetchNextPinSuggestions, numberOfColumns]);

  useEffect(() => {
    if (viewportWidth) {
      const calculatedColumns = getNumberOfColumns(viewportWidth);
      setNumberOfColumns(calculatedColumns);
    }
  }, [viewportWidth]);

  const gridWidthPx = numberOfColumns
    ? numberOfColumns * GRID_COLUMN_WIDTH_WITH_MARGINS_PX
    : undefined;

  return (
    <div>
      <ToastContainer position="bottom-left" autoClose={5000} />
      <HeaderAuthenticatedClient
        accounts={accounts}
        labels={labels.component.Header}
      />
      <main className={styles.container}>
        {
          // NB: `numberOfColumns` will be undefined on initial render
          numberOfColumns && (
            <div
              className={styles.grid}
              style={{
                columnCount: numberOfColumns,
                width: `${gridWidthPx}px`,
              }}
              data-testid="pin-suggestions-container"
            >
              {pinSuggestions.map((pinSuggestion) => (
                <div className={styles.pinSuggestion} key={pinSuggestion.id}>
                  <PinSuggestion
                    pinSuggestion={pinSuggestion}
                    labels={labels}
                  />
                </div>
              ))}
              <div ref={scrolledToBottomSentinel}></div>
            </div>
          )
        }
      </main>
    </div>
  );
};

export default HomePageAuthenticatedClient;
