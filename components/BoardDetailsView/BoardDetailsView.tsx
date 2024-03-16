import { BoardWithFullDetails } from "@/lib/types";

const BoardDetailsView = ({ board }: { board: BoardWithFullDetails }) => {
  const { author, pins } = board;

  return (
    <div>
      <div>Author: {JSON.stringify(author)}</div>
      <div>Pins: {JSON.stringify(pins)}</div>
    </div>
  );
};

export default BoardDetailsView;
