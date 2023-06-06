import styles from "./HomePageAuthenticated.module.css";
import { PinSuggestion } from "./PinSuggestion";

type HomePageAuthenticatedClientProps = {
  pinSuggestions: PinSuggestion[];
};

const HomePageAuthenticatedClient = ({ pinSuggestions}: HomePageAuthenticatedClientProps) => {
  return <main className={styles.container}></main>;
};

export default HomePageAuthenticatedClient;
