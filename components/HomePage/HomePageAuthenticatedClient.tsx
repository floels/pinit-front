import styles from "./HomePageAuthenticatedClient.module.css";
import PinSuggestion, { PinSuggestionType } from "./PinSuggestion";

type HomePageAuthenticatedClientProps = {
  initialPinSuggestions: PinSuggestionType[];
};

const HomePageAuthenticatedClient = ({ initialPinSuggestions}: HomePageAuthenticatedClientProps) => {
  return (
    <main className={styles.container}>
      {initialPinSuggestions.map((pinSuggestion) => <PinSuggestion key={pinSuggestion.id} {...pinSuggestion} />)}
    </main>
  );
};

export default HomePageAuthenticatedClient;
