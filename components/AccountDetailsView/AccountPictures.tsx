import { useTranslations } from "next-intl";
import { Account } from "@/lib/types";
import Image from "next/image";
import styles from "./AccountPictures.module.css";

type AccountPicturesProps = {
  account: Account;
};

const BACKGROUND_PICTURE_WIDTH_PX = 656;
const BACKGROUND_PICTURE_HEIGHT_PX = 370;

const PROFILE_PICTURE_WIDTH_PX = 120;
const PROFILE_PICTURE_HEIGHT_PX = 120;

const AccountPictures = ({ account }: AccountPicturesProps) => {
  const { displayName, profilePictureURL, backgroundPictureURL, initial } =
    account;

  const t = useTranslations("AccountDetails");

  let backgroudPicture;

  if (backgroundPictureURL) {
    backgroudPicture = (
      <Image
        src={backgroundPictureURL}
        width={BACKGROUND_PICTURE_WIDTH_PX}
        height={BACKGROUND_PICTURE_HEIGHT_PX}
        alt={`${t("ALT_BACKGROUND_PICTURE_OF")} ${displayName}`}
        className={styles.backgroundPicture}
      />
    );
  }

  let profilePicture;

  if (profilePictureURL) {
    let profilePictureStyles = [styles.profilePicture];

    if (backgroundPictureURL) {
      profilePictureStyles.push(styles.profilePictureWithBackgroundPicture);
    }

    profilePicture = (
      <Image
        src={profilePictureURL}
        width={PROFILE_PICTURE_WIDTH_PX}
        height={PROFILE_PICTURE_HEIGHT_PX}
        alt={`${t("ALT_PROFILE_PICTURE_OF")} ${displayName}`}
        className={profilePictureStyles.join(" ")}
      />
    );
  } else {
    profilePicture = <span className={styles.initialContainer}>{initial}</span>;
  }

  const containerStyles = [styles.container];

  if (backgroundPictureURL) {
    containerStyles.push(styles.containerWithBackgroundPicture);
  }

  return (
    <div className={containerStyles.join(" ")}>
      {backgroudPicture}
      {profilePicture}
    </div>
  );
};

export default AccountPictures;
