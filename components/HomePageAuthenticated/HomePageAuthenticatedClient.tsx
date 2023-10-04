"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import styles from "./HomePageAuthenticatedClient.module.css";
import PinSuggestion, { PinSuggestionType } from "./PinSuggestion";
import { AccountType } from "@/app/[locale]/page";
import HeaderAuthenticatedClient from "../Header/HeaderAuthenticatedClient";

type HomePageAuthenticatedClientProps = {
  accounts: AccountType[];
  initialPinSuggestions: PinSuggestionType[];
  labels: {
    commons: { [key: string]: any };
    component: { [key: string]: any };
  };
};

const HomePageAuthenticatedClient = ({
  accounts,
  initialPinSuggestions,
  labels,
}: HomePageAuthenticatedClientProps) => {
  const scrolledToBottomSentinel = useRef(null);

  const [currentEndpointPage, setCurrentEndpointPage] = useState(1);
  const [pinSuggestions, setPinSuggestions] = useState(initialPinSuggestions);

  // Fetch next page of pin suggestions when user scrolled to the bottom of the screen
  const updateStateWithNewPinSuggestionsResponse = async (
    newPinSuggestionsResponse: Response,
  ) => {
    const newPinSuggestionsResponseData =
      await newPinSuggestionsResponse.json();

    setPinSuggestions((pinSuggestions) => [
      ...pinSuggestions,
      ...newPinSuggestionsResponseData.results,
    ]);
    setCurrentEndpointPage((currentEndpointPage) => currentEndpointPage + 1);
  };

  const fetchNextPinSuggestions = useCallback(async () => {
    const nextEndpointPage = currentEndpointPage + 1;

    const newPinSuggestionsResponse = await fetch(
      `/api/pins/suggestions?page=${nextEndpointPage}`,
      { method: "GET" },
    );

    if (newPinSuggestionsResponse.ok) {
      await updateStateWithNewPinSuggestionsResponse(newPinSuggestionsResponse);
      return;
    }

    // KO response from the server: display a toast message
    toast.warn(labels.component.ERROR_FETCH_PIN_SUGGESTIONS);
  }, [currentEndpointPage]);

  const fetchNextPinSuggestionsAndFallBack = async () => {
    try {
      await fetchNextPinSuggestions();
    } catch (error) {
      toast.warn(labels.commons.CONNECTION_ERROR);
    }
  };

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
  }, [fetchNextPinSuggestions]);

  return (
    <div>
      <ToastContainer position="bottom-left" autoClose={5000} />
      <HeaderAuthenticatedClient
        accounts={accounts}
        labels={labels.component.Header}
      />
      <main className={styles.container}>
        <div className={styles.grid} data-testid="pin-suggestions-container">
          {pinSuggestions.map((pinSuggestion) => (
            <div className={styles.pinSuggestion} key={pinSuggestion.id}>
              <PinSuggestion pinSuggestion={pinSuggestion} labels={labels} />
            </div>
          ))}
          <div ref={scrolledToBottomSentinel}></div>
        </div>
      </main>
    </div>
  );
};

export default HomePageAuthenticatedClient;
