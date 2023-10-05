import { useEffect, useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeaderSearchBar.module.css";

type HeaderSearchBarPros = {
  labels: { [key: string]: string };
};

const DEBOUNCE_DURATION_MS = 300;

const HeaderSearchBar = ({ labels }: HeaderSearchBarPros) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);

  const handleFocusInput = () => {
    setIsInputFocused(true);
  };

  const handleBlurSearchBarInput = () => {
    setIsInputFocused(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

    setAutocompleteSuggestions(responseData.results);
  }, [inputValue]);

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
          data-testid="search-bar-icon"
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
        onBlur={handleBlurSearchBarInput}
        data-testid="search-bar-input"
      />
      {isInputFocused && autocompleteSuggestions.length > 0 && (
        <ul
          className={styles.autocompleteSuggestionsList}
          data-testid="autocomplete-suggestions-list"
        >
          {autocompleteSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={styles.autocompleteSuggestionsListItem}
              data-testid="autocomplete-suggestions-list-item"
            >
              <FontAwesomeIcon
                icon={faSearch}
                className={styles.autocompleteSuggestionSearchIcon}
              />
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HeaderSearchBar;
