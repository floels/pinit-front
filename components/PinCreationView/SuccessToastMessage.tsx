import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./SuccessToastMessage.module.css";

type SuccessToastMessageProps = {
  pinId: string;
};

const SuccessToastMessage = ({ pinId }: SuccessToastMessageProps) => {
  const t = useTranslations("PinCreation");

  return (
    <div
      className={styles.successToastMessageContainer}
      data-testid="success-toast-message"
    >
      <p>{t("PIN_PUBLISHED")}</p>
      <Link href={`/pin/${pinId}`} className={styles.successToastMessageLink}>
        {t("VIEW")}
      </Link>
    </div>
  );
};

export default SuccessToastMessage;
