import { useTranslations } from "next-intl";
import Image from "next/image";
import { getTranslationsObject } from "@/lib/utils/i18n";
import styles from "./AccountDetailsView.module.css";

type AccountDetailsViewProps = {
  username: string;
  displayName: string;
  profilePictureURL: string;
  backgroundPictureURL: string;
  description?: string;
};

const BACKGROUND_PICTURE_WIDTH_PX = 656;
const BACKGROUND_PICTURE_HEIGHT_PX = 370;

const PROFILE_PICTURE_WIDTH_PX = 120;
const PROFILE_PICTURE_HEIGHT_PX = 120;

const AccountDetailsView = ({
  username,
  displayName,
  profilePictureURL,
  backgroundPictureURL,
  description,
}: AccountDetailsViewProps) => {
  const translator = useTranslations("PinDetails");
  const translations = getTranslationsObject("PinDetails", translator);

  const shouldRenderBackgroundPicture = !!backgroundPictureURL;

  return (
    <div className={styles.container}>
      <div className={styles.accountDetails}>
        {shouldRenderBackgroundPicture && (
          <Image
            src={backgroundPictureURL}
            width={BACKGROUND_PICTURE_WIDTH_PX}
            height={BACKGROUND_PICTURE_HEIGHT_PX}
            alt={`${translations.BACKGROUND_PICTURE_OF} ${displayName}`}
          />
        )}
        <Image
          src={profilePictureURL}
          width={PROFILE_PICTURE_WIDTH_PX}
          height={PROFILE_PICTURE_HEIGHT_PX}
          alt={`${translations.PROFILE_PICTURE_OF} ${displayName}`}
        />
        <h1>{displayName}</h1>
        <div>{username}</div>
        <div>{description}</div>
      </div>
    </div>
  );
};

export default AccountDetailsView;
