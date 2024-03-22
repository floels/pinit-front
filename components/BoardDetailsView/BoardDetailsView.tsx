import { BoardWithFullDetails } from "@/lib/types";
import { useTranslations } from "next-intl";
import Image from "next/image";

const AUTHOR_PROFILE_PICTURE_HEIGHT_PX = 48;
const AUTHOR_PROFILE_PICTURE_WIDTH_PX = 48;

const BoardDetailsView = ({ board }: { board: BoardWithFullDetails }) => {
  const t = useTranslations("BoardDetails");

  const { name, author, pins } = board;

  const {
    profilePictureURL: authorProfilePictureURL,
    initial: authorInitial,
    displayName: authorDisplayName,
  } = author;

  let displayAuthorProfilePicture;

  if (authorProfilePictureURL) {
    displayAuthorProfilePicture = (
      <Image
        src={authorProfilePictureURL}
        alt={`${t("AUTHOR_PROFILE_PICTURE_ALT")} ${authorDisplayName}`}
        height={AUTHOR_PROFILE_PICTURE_HEIGHT_PX}
        width={AUTHOR_PROFILE_PICTURE_WIDTH_PX}
      />
    );
  } else {
    displayAuthorProfilePicture = <div>{authorInitial}</div>;
  }

  return (
    <div>
      <h1>{name}</h1>
      {displayAuthorProfilePicture}
      <div>Pins: {JSON.stringify(pins)}</div>
    </div>
  );
};

export default BoardDetailsView;
