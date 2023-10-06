import { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeaderSearchBar.module.css";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

type HeaderSearchBarPros = {
  labels: { [key: string]: string };
};

const DEBOUNCE_DURATION_MS = 300;

const HeaderSearchBar = ({ labels }: HeaderSearchBarPros) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);

  const handleFocusInput = () => {
    setIsInputFocused(true);
  };

  const handleBlurInput = () => {
    setIsInputFocused(false);
  };

  // We need this addition event handler for when the user clicks a suggestion link
  // in order to circumvent a race condition. Without this event handler, when the user
  // clicks on a suggestion <Link /> (see below), this `handleBlurInput` handler
  // is called. This will immediately set isInputFocused to false and unmount the <Link />,
  // and the transition to the target route will not take place.
  const getSuggestionLinkClickHandler = (suggestion: string) => {
    return () => {
      router.push(`/search/pins?q=${suggestion}`);
    };
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
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

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setInputValue("");
        if (inputRef.current) {
          inputRef.current.blur();
        }
      } else if (event.key === "Enter" && inputValue !== "") {
        router.push(`/search/pins?q=${inputValue}`);
      }
    },
    [inputValue, router],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const fetchAutocompleteSuggestions = useCallback(async () => {
    let response;

    try {
      response = await fetch(
        `/api/pins/search/autocomplete?search=${inputValue}`,
        { method: "GET" },
      );
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

    const responseData = await response.json();

    const refinedSuggestions = getRefinedSuggestions(
      inputValue,
      responseData.results,
    );

    setAutocompleteSuggestions(refinedSuggestions);
  }, [inputValue]);

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
    const remainingSuggestions = suggestionsfromAPI.slice(
      0,
      MAX_SUGGESTIONS - 1,
    );
    return [searchTerm, ...remainingSuggestions];
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (inputValue) {
        fetchAutocompleteSuggestions();
      } else {
        setAutocompleteSuggestions([]);
      }
    }, DEBOUNCE_DURATION_MS);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [inputValue, fetchAutocompleteSuggestions]);

  const handleClickClearIcon = () => {
    setInputValue("");
    setIsInputFocused(false);
  };

  return (
    <div
      className={`${styles.container}
          ${isInputFocused ? styles.containerInputFocused : ""} 
        `}
    >
      {!isInputFocused && (
        <FontAwesomeIcon
          icon={faSearch}
          className={styles.inputSearchIcon}
          data-testid="search-icon"
        />
      )}
      <input
        type="text"
        ref={inputRef}
        value={inputValue}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className={styles.searchInput}
        placeholder={labels.PLACEHOLDER_SEARCH}
        onChange={handleInputChange}
        onFocus={handleFocusInput}
        onBlur={handleBlurInput}
        data-testid="search-bar-input"
      />
      {isInputFocused && (
        /* We need to attach `handleClickClearIcon` to `onMouseDown` instead of the usual `onClick`,
        because otherwise there is a race condition between `handleClickClearIcon` and `handleBlurSearchBarInput`,
        resulting in ``handleClickClearIcon` not being called. For some reason this doesn't happen with `onMouseDown`.*/
        <div
          className={styles.clearIconContainer}
          onMouseDown={handleClickClearIcon}
          data-testid="clear-icon"
        >
          <FontAwesomeIcon icon={faCircleXmark} size="lg" />
        </div>
      )}
      {isInputFocused && autocompleteSuggestions.length > 0 && (
        <ul
          className={styles.autocompleteSuggestionsList}
          data-testid="autocomplete-suggestions-list"
        >
          {autocompleteSuggestions.map((suggestion, index) => (
            <Link
              href={`/search/pins?q=${suggestion}`}
              key={`autocomplete-suggestion-link-${index}`}
              className={styles.autoCompleteSuggestionsLink}
              onMouseDown={getSuggestionLinkClickHandler(suggestion)}
            >
              <li
                className={styles.autocompleteSuggestionsListItem}
                data-testid="autocomplete-suggestions-list-item"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className={styles.autocompleteSuggestionSearchIcon}
                />
                {suggestion}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HeaderSearchBar;
