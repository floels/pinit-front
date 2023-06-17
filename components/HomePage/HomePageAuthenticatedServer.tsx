import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";
import { PinSuggestionType } from "./PinSuggestion";

type HomePageAuthenticatedServerProps = {
    initialPinSuggestions: PinSuggestionType[];
};

const HomePageAuthenticatedServer = ({ initialPinSuggestions }: HomePageAuthenticatedServerProps) => {
    // TODO: fetch and pass down translations
    
    return <HomePageAuthenticatedClient initialPinSuggestions={initialPinSuggestions} />;
};

export default HomePageAuthenticatedServer;
