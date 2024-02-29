import { FormEvent, useEffect, useRef } from "react";
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
  searchSuggestions: string[];
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
  searchSuggestions,
  getSuggestionLinkClickHandler,
}: HeaderSearchBarProps) => {
  const router = useRouter();

  const t = useTranslations("HeaderAuthenticated");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    router.push(`/search/pins?q=${inputValue}`);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onPressEscape();
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

  return (
    <form
      onSubmit={handleSubmit}
      className={`${styles.container}
          ${isInputFocused ? styles.containerInputFocused : ""} 
        `}
      data-testid="header-search-bar"
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
      {isInputFocused && searchSuggestions.length > 0 && (
        <ul
          className={styles.searchSuggestionsList}
          data-testid="search-suggestions-list"
        >
          {searchSuggestions.map((suggestion, index) => (
            <Link
              href={`/search/pins?q=${suggestion}`}
              key={`search-suggestion-link-${index}`}
              className={styles.searchSuggestionsLink}
              onMouseDown={getSuggestionLinkClickHandler(suggestion)}
            >
              <li
                className={styles.searchSuggestionsListItem}
                data-testid="search-suggestions-list-item"
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className={styles.searchSuggestionSearchIcon}
                />
                {suggestion}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </form>
  );
};

export default HeaderSearchBar;
