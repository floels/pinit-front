import styles from "./FourthFold.module.css";
import TextAndLink from "./TextAndLink";

type FourthFoldProps = {
  labels: { [key: string]: any };
};

const FourthFold = ({ labels }: FourthFoldProps) => {
  const textAndLinkLabels = {
    header: labels.HEADER,
    paragraph: labels.PARAGRAPH,
    link: labels.LINK,
  };

  const textAndLinkColors = {
    primary: "--color-red-fiery",
    secondary: "--color-pink",
  };

  return (
    <div className={styles.container}>
      <div className={styles.picturesArea}></div>
      <div className={styles.textArea}>
        <TextAndLink
          labels={textAndLinkLabels}
          linkTarget="#"
          colors={textAndLinkColors}
        />
      </div>
    </div>
  );
};

export default FourthFold;
