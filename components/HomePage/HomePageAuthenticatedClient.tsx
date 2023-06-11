import styles from "./HomePageAuthenticatedClient.module.css";
import PinSuggestion, { PinSuggestionType } from "./PinSuggestion";

type HomePageAuthenticatedClientProps = {
  pinSuggestions: PinSuggestionType[];
};

const HomePageAuthenticatedClient = ({ pinSuggestions}: HomePageAuthenticatedClientProps) => {
  return (
    <main className={styles.container}>
      {pinSuggestions.map((pinSuggestion) => <PinSuggestion key={pinSuggestion.id} {...pinSuggestion} />)}
    </main>
  );
};

export default HomePageAuthenticatedClient;
