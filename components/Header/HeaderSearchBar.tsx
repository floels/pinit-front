import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "./HeaderSearchBar.module.css";

type HeaderSearchBarPros = {
  labels: { [key: string]: string };
};

const HeaderSearchBar = ({ labels }: HeaderSearchBarPros) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleFocusInput = () => {
    setIsInputFocused(true);
  };

  const handleBlurSearchBarInput = () => {
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
          className={styles.searchIcon}
          data-testid="search-bar-icon"
        />
      )}
      <input
        type="text"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className={styles.searchInput}
        placeholder={labels.PLACEHOLDER_SEARCH}
        onFocus={handleFocusInput}
        onBlur={handleBlurSearchBarInput}
      />
    </div>
  );
};

export default HeaderSearchBar;
