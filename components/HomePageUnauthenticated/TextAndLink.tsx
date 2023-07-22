import styles from "./TextAndLink.module.css";

type TextAndLinkProps = {
  labels: { [key: string]: any };
  linkTarget: string;
  colors: {
    primary: string;
    secondary: string;
  };
};

const TextAndLink = ({ labels, linkTarget, colors }: TextAndLinkProps) => {
  return (
    <div
      className={styles.container}
      style={{ color: `var(${colors.primary})` }}
    >
      <div className={styles.header}>{labels.header}</div>
      <div className={styles.paragraph}>{labels.paragraph}</div>
      <a
        href={linkTarget}
        className={styles.link}
        style={{
          backgroundColor: `var(${colors.primary})`,
          color: `var(${colors.secondary})`,
        }}
      >
        {labels.link}
      </a>
    </div>
  );
};

export default TextAndLink;
