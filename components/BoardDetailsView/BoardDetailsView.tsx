import { BoardWithFullDetails } from "@/lib/types";

const BoardDetailsView = ({ board }: { board: BoardWithFullDetails }) => {
  const { name, author, pins } = board;

  const { profilePictureURL: authorProfilePictureURL, initial: authorInitial } =
    author;

  return (
    <div>
      <h1>{name}</h1>
      <div>Author: {JSON.stringify(author)}</div>
      <div>Pins: {JSON.stringify(pins)}</div>
    </div>
  );
};

export default BoardDetailsView;
