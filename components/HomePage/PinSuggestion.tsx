import Image from "next/image";
import { useTranslations } from "next-intl";

export type PinSuggestion = {
    id: string;
    title: string;
    imageURL: string;
    authorUsername: string;
    authorDisplayName: string;
};

const PinSuggestion = ({ id, title, imageURL, authorUsername, authorDisplayName}: PinSuggestion) => {
    const t = useTranslations("HomePageAuthenticated");
    
    return (
        <Image
            alt={title ? title : `${t("PIN_BY")} ${authorDisplayName}`}
            src={imageURL}
        />
    );
};

export default PinSuggestion;
