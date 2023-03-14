import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "./OverlayModal.module.css";

type OverlayModalProps = {
  children: ReactNode;
  onClose: () => void;
};

const OverlayModal = ({ onClose, children }: OverlayModalProps) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.closeButtonContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} size="2x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default OverlayModal;
