import Image from "next/image";
import { useTranslations } from "next-intl";

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
        <Image
            alt={title ? title : `${t("PIN_BY")} ${authorDisplayName}`}
            src={imageURL}
        />
    );
};

export default PinSuggestion;
