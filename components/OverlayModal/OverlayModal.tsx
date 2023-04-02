import React, { ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./OverlayModal.module.css";

type OverlayModalProps = {
  children: ReactNode;
  onClose: () => void;
};

const OverlayModal = ({ onClose, children }: OverlayModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClickOut = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClickOut}>
      <div
        className={styles.modal}
        onClick={
          (e) => e.stopPropagation() /* to allow for close on click out */
        }
      >
        {isLoading && (
          <div
            className={styles.loadingOverlay}
            data-testid="overlay-modal-loading-overlay"
          >
            <FontAwesomeIcon
              icon={faSpinner}
              size="2x"
              spin
              className={styles.loadingSpinner}
            />
          </div>
        )}
        <div className={styles.closeButtonContainer}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            data-testid="overlay-modal-close-button"
          >
            <FontAwesomeIcon icon={faXmark} size="2x" />
          </button>
        </div>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child as React.ReactElement<any>, {
            setIsLoading,
          });
        })}
      </div>
    </div>
  );
};

export default OverlayModal;
