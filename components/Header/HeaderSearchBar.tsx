import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeaderSearchBar.module.css";

type HeaderSearchBarPros = {
  labels: { [key: string]: string };
};

const HeaderSearchBar = ({ labels }: HeaderSearchBarPros) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

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

  return (
    <div
      className={`${styles.container}
          ${isInputFocused ? styles.containerInputFocused : ""} 
        `}
    >
      {!isInputFocused && (
        <FontAwesomeIcon
          icon={faSearch}
          className={styles.searchIcon}
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
      />
    </div>
  );
};

export default HeaderSearchBar;
