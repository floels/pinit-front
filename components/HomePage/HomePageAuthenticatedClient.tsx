"use client";

import { useViewportWidth } from "@/lib/utils/custom-hooks";
import styles from "./HomePageAuthenticatedClient.module.css";
import PinSuggestion, { PinSuggestionType } from "./PinSuggestion";
import { useRef, useState, useEffect } from "react";
import { fetchWithAuthentication } from "@/lib/utils/fetch";
import { ENDPOINT_GET_PIN_SUGGESTIONS } from "@/lib/constants";
import Cookies from "js-cookie";
import { AccountType } from "@/app/[locale]/page";
import HeaderAuthenticatedClient from "../Header/HeaderAuthenticatedClient";

type HomePageAuthenticatedClientProps = {
  accounts: AccountType[];
  initialPinSuggestions: PinSuggestionType[];
  labels: { [key: string]: any };
};

const GRID_COLUMN_WIDTH_WITH_MARGINS_PX = 236 + 2 * 8; // each column has a set width of 236px and side margins of 8px

const getNumberOfColumns = (viewportWidth: number) => {
  const theoreticalNumberOfColumns = Math.floor(viewportWidth / GRID_COLUMN_WIDTH_WITH_MARGINS_PX);

  // We force the number of columns to be between 2 and 6:
  const boundedNumberOfColumns = Math.min(Math.max(theoreticalNumberOfColumns, 2), 6);

  return boundedNumberOfColumns;
};

const HomePageAuthenticatedClient = ({ accounts, initialPinSuggestions, labels }: HomePageAuthenticatedClientProps) => {
  const scrolledToBottomSentinel = useRef(null);
  
  const [currentEndpointPage, setCurrentEndpointPage] = useState(1);
  const [pinSuggestions, setPinSuggestions] = useState(initialPinSuggestions);

  useEffect(() => {
    const getNextPinSuggestions = async () => {
      const nextEndpointPage = currentEndpointPage + 1;
      const accessToken = Cookies.get("accessToken") as string;
  
      // TODO: handle fetch fail
      const newPinSuggestionsResponse = await fetchWithAuthentication({
        endpoint: `${ENDPOINT_GET_PIN_SUGGESTIONS}?page=${nextEndpointPage}`,
        accessToken
      });
  
      if (newPinSuggestionsResponse.ok) {
        const newPinSuggestionsResponseData = await newPinSuggestionsResponse.json();
    
        setPinSuggestions(pinSuggestions => [...pinSuggestions, ...newPinSuggestionsResponseData.results]);
        setCurrentEndpointPage(currentEndpointPage => currentEndpointPage + 1);
      }
    };

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          getNextPinSuggestions();
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
  }, [currentEndpointPage]);

  const viewportWidth = useViewportWidth();

  let numberOfColumns, gridWidthPx;

  // `viewportWidth` will be `undefined` on initial render.
  // We handle this case aside in order to avoid a flash of content with the wrong number of columns.
  if (viewportWidth) {
    numberOfColumns = getNumberOfColumns(viewportWidth);
    gridWidthPx = numberOfColumns * GRID_COLUMN_WIDTH_WITH_MARGINS_PX;
  }

  return (
    <div>
      <HeaderAuthenticatedClient accounts={accounts} labels={labels.Header} />
      <main className={styles.container}>
        {numberOfColumns && // As mentioned above, `numberOfColumns` will be undefined on initial render
          <div
            className={styles.grid}
            style={{ columnCount: numberOfColumns, width: `${gridWidthPx}px` }}
            data-testid="pin-suggestions-container"
          >
            {pinSuggestions.map((pinSuggestion) => (
              <div className={styles.pinSuggestion} key={pinSuggestion.id}>
                <PinSuggestion pinSuggestion={pinSuggestion} labels={labels} />
              </div>
            ))}
          </div>
        }
        <div ref={scrolledToBottomSentinel}></div>
      </main>
    </div>
  );
};

export default HomePageAuthenticatedClient;
