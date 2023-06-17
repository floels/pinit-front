import { useTranslations } from "next-intl";
import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";
import { PinSuggestionType } from "./PinSuggestion";
import { getTranslationsObject } from "@/lib/utils/i18n";

type HomePageAuthenticatedServerProps = {
    initialPinSuggestions: PinSuggestionType[];
};

const HomePageAuthenticatedServer = ({ initialPinSuggestions }: HomePageAuthenticatedServerProps) => {
    const translator = useTranslations("HomePageAuthenticated");
    const translations = getTranslationsObject("HomePageAuthenticated", translator);

    return <HomePageAuthenticatedClient initialPinSuggestions={initialPinSuggestions} labels={translations} />;
};

export default HomePageAuthenticatedServer;
