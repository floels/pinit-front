import { Board } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

type BoardThumbnailProps = {
  board: Board;
};

const COVER_PICTURE_SIZE_PX = 100;

const BoardThumbnail = ({ board }: BoardThumbnailProps) => {
  const { id, title, firstImageURLs } = board;

  return (
    <Link href={`/boards/${id}`}>
      <Image
        src={firstImageURLs[0]}
        alt={title}
        width={COVER_PICTURE_SIZE_PX}
        height={COVER_PICTURE_SIZE_PX}
      />
      <span>{title}</span>
    </Link>
  );
};

export default BoardThumbnail;
