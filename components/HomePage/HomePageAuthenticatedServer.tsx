import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";

type HomePageAuthenticatedServerProps = {
    accessToken: string;
};

const fetchPinSuggestions = async (accessToken: string) => {
    // TODO: implement data fetching
    return [{
        id: "0000",
        title: "This is a pin",
        imageURL: "https://image.url.com",
        authorUsername: "johndoe",
        authorDisplayName: "John DOe",
    }];
  };

const HomePageAuthenticatedServer = async ({ accessToken }: HomePageAuthenticatedServerProps) => {
    const pinSuggestions = await fetchPinSuggestions(accessToken);

    return <HomePageAuthenticatedClient pinSuggestions={pinSuggestions} />;
};

export default HomePageAuthenticatedServer;
