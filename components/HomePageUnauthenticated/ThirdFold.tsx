import TextAndLink from "./TextAndLink";
import styles from "./ThirdFold.module.css";

type ThirdFoldProps = {
  labels: { [key: string]: any };
};

const ThirdFold = ({ labels }: ThirdFoldProps) => {
  const textAndLinkLabels = {
    header: labels.SAVE_IDEAS,
    paragraph: labels.COLLECT_FAVORITES,
    link: labels.EXPLORE,
  };

  const textAndLinkColors = {
    primary: "--color-teal",
    secondary: "--color-green-minty",
  };

  return (
    <div className={styles.container}>
      <div className={styles.textArea}>
        <TextAndLink
          labels={textAndLinkLabels}
          linkTarget="#"
          colors={textAndLinkColors}
        />
      </div>
      <div className={styles.picturesArea}></div>
    </div>
  );
};

export default ThirdFold;
