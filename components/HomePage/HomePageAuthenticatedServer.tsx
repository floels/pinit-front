import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";

type HomePageAuthenticatedServerProps = {
    accessToken: string;
};

const fetchPinSuggestions = async (accessToken: string) => {
    // TODO: implement data fetching
    return [{
        id: "0000",
        title: "This is a pin",
        imageURL: "https://i.pinimg.com/236x/e3/41/4b/e3414b2fcf00375a199ba6964be551af.jpg",
        authorUsername: "johndoe",
        authorDisplayName: "John DOe",
    }];
  };

const HomePageAuthenticatedServer = async ({ accessToken }: HomePageAuthenticatedServerProps) => {
    const pinSuggestions = await fetchPinSuggestions(accessToken);

    return <HomePageAuthenticatedClient pinSuggestions={pinSuggestions} />;
};

export default HomePageAuthenticatedServer;
