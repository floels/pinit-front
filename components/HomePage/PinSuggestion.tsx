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
            <img
                alt={title ? title : `${t("PIN_BY")} ${authorDisplayName}`}
                src={imageURL}
                width={256}
                className={styles.image}
            />
        </div>
    );
};

export default PinSuggestion;
