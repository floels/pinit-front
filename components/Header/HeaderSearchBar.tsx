import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./HeaderSearchBar.module.css";

type HeaderSearchBarProps = {
  inputValue: string;
  isInputFocused: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onClickClearIcon: () => void;
  onPressEscape: () => void;
  autocompleteSuggestions: string[];
  getSuggestionLinkClickHandler: (suggestion: string) => () => void;
};

const HeaderSearchBar = ({
  inputValue,
  isInputFocused,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onClickClearIcon,
  onPressEscape,
  autocompleteSuggestions,
  getSuggestionLinkClickHandler,
}: HeaderSearchBarProps) => {
  const router = useRouter();

  const t = useTranslations("HeaderAuthenticated");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onPressEscape();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    } else if (event.key === "Enter" && inputValue !== "") {
      router.push(`/search/pins?q=${inputValue}`);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
        placeholder={t("PLACEHOLDER_SEARCH")}
        onChange={onInputChange}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        data-testid="search-bar-input"
      />
      {isInputFocused && (
        /* We need to attach `handleClickClearIcon` to `onMouseDown` instead of the usual `onClick`,
        because otherwise there is a race condition between `handleClickClearIcon` and `handleBlurSearchBarInput`,
        resulting in ``handleClickClearIcon` not being called. For some reason this doesn't happen with `onMouseDown`.*/
        <div
          className={styles.clearIconContainer}
          onMouseDown={onClickClearIcon}
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
