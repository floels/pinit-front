import PictureSlider from "./PictureSlider";
import styles from "./HomePageContentNotLoggedIn.module.css";

const HomePageContentLoggedIn = () => {
  return (
    <div className={styles.hero}>
      <PictureSlider />
    </div>
  );
};

export default HomePageContentLoggedIn;
