import styles from "./PinSuggestion.module.css";

export type PinSuggestionType = {
    id: string;
    title: string;
    imageURL: string;
    authorUsername: string;
    authorDisplayName: string;
};

type PinSuggestionProps = {
    pinSuggestion: PinSuggestionType;
    labels: { [key: string]: any };
}

const PinSuggestion = ({ pinSuggestion, labels }: PinSuggestionProps) => {    
    return (
        <div className={styles.container}>
            {/* We don't use Next's Image component because we don't know the image's display height in advance. */}
            <img
                alt={pinSuggestion.title ? pinSuggestion.title : `${labels.PIN_BY} ${pinSuggestion.authorDisplayName}`}
                src={pinSuggestion.imageURL}
                className={styles.image}
            />
            {pinSuggestion.title && <div className={styles.title}>{pinSuggestion.title}</div>}
        </div>
    );
};

export default PinSuggestion;
