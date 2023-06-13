import { useTranslations } from "next-intl";
import styles from "./PinSuggestion.module.css";

export type PinSuggestionType = {
    id: string;
    title: string;
    imageURL: string;
    authorUsername: string;
    authorDisplayName: string;
};

const PinSuggestion = ({ id, title, imageURL, authorUsername, authorDisplayName }: PinSuggestionType) => {
    const t = useTranslations("HomePageAuthenticated");
    
    return (
        <div className={styles.container}>
            {/* We don't use Next's Image component because we don't know the image's display height in advance */}
            <img
                alt={title ? title : `${t("PIN_BY")} ${authorDisplayName}`}
                src={imageURL}
                className={styles.image}
            />
            {title && <div className={styles.title}>{title}</div>}
        </div>
    );
};

export default PinSuggestion;
