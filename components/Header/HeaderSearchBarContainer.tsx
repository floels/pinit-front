import { useEffect, useState, useRef, useCallback } from "react";
import debounce from "lodash/debounce";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { API_ROUTE_PINS_SEARCH_AUTOCOMPLETE } from "@/lib/constants";
import HeaderSearchBar from "./HeaderSearchBar";

export const AUTOCOMPLETE_DEBOUNCE_TIME_MS = 300;

const getRefinedSuggestions = (
  searchTerm: string,
  suggestionsfromAPI: string[],
) => {
  const MAX_SUGGESTIONS = 12;

  const isSearchTermIncludedInSuggestions =
    suggestionsfromAPI.includes(searchTerm);

  if (isSearchTermIncludedInSuggestions) {
    // NB: normally the API returns 12 suggestions at most
    // so this `slice` is just for precaution.
    return suggestionsfromAPI.slice(0, MAX_SUGGESTIONS);
  }

  // If search term is not present, add searchTerm as the first suggestion
  // (and drop the last suggestion received from the API):
  const remainingSuggestions = suggestionsfromAPI.slice(0, MAX_SUGGESTIONS - 1);
  return [searchTerm, ...remainingSuggestions];
};

const HeaderSearchBarContainer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  // We need this additional handler when the user clicks a suggestion link,
  // in order to circumvent a race condition. Without this event handler, when the user
  // clicks on a suggestion <Link /> (see below), this `handleBlurInput` handler
  // is called. This will immediately set isInputFocused to false and unmount the <Link />,
  // and the transition to the target route will not take place.
  const getSuggestionLinkClickHandler = (suggestion: string) => {
    return () => {
      setInputValue(suggestion); // Theoretically this shouldn't be needed since the input's value
      // is automatically updated based on the route, but updating it here will give a better impression
      // of reactivity.

      router.push(`/search/pins?q=${suggestion}`);
    };
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handlePressEscape = () => {
    setInputValue("");
  };

  // Initialize the input value to the search param if present:
  useEffect(() => {
    if (pathname === "/search/pins") {
      const searchTerm = searchParams.get("q");

      if (searchTerm) {
        setInputValue(searchTerm);
      }
    }
  }, [pathname, searchParams]);

  const fetchAutocompleteSuggestions = useCallback(
    async ({ searchTerm }: { searchTerm: string }) => {
      let response, responseData;

      try {
        response = await fetch(
          `${API_ROUTE_PINS_SEARCH_AUTOCOMPLETE}?search=${searchTerm}`,
        );

        responseData = await response.json();
      } catch (error) {
        // Fail silently
        setAutocompleteSuggestions([]);
        return;
      }

      if (!response.ok) {
        // Fail silently
        setAutocompleteSuggestions([]);
        return;
      }

      const refinedSuggestions = getRefinedSuggestions(
        searchTerm,
        responseData.results,
      );

      setAutocompleteSuggestions(refinedSuggestions);
    },
    [setAutocompleteSuggestions],
  );

  useEffect(() => {
    if (!inputValue) {
      setAutocompleteSuggestions([]);
      return;
    }

    const debouncedFetchAutoCompleteSuggestions = debounce(
      fetchAutocompleteSuggestions,
      AUTOCOMPLETE_DEBOUNCE_TIME_MS,
    );

    debouncedFetchAutoCompleteSuggestions({ searchTerm: inputValue });

    return () => {
      debouncedFetchAutoCompleteSuggestions.cancel();
    };
  }, [inputValue, fetchAutocompleteSuggestions]);

  const handleClickClearIcon = () => {
    setInputValue("");
    setIsInputFocused(false);
  };

  return (
    <HeaderSearchBar
      inputValue={inputValue}
      isInputFocused={isInputFocused}
      onInputChange={handleInputChange}
      onInputFocus={handleInputFocus}
      onInputBlur={handleInputBlur}
      onClickClearIcon={handleClickClearIcon}
      onPressEscape={handlePressEscape}
      autocompleteSuggestions={autocompleteSuggestions}
      getSuggestionLinkClickHandler={getSuggestionLinkClickHandler}
    />
  );
};

export default HeaderSearchBarContainer;
