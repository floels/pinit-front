export const serializePinWithAuthorData = (pin: any) => {
  return {
    id: pin.unique_id,
    imageURL: pin.image_url,
    title: pin.title,
    description: pin.description,
    authorUsername: pin.author.username,
    authorDisplayName: pin.author.display_name,
    authorProfilePictureURL: pin.author.profile_picture_url,
  };
};

export const serializePinsWithAuthorData = (pins: any) => {
  return pins.map(serializePinWithAuthorData);
};

export const serializeAccountPublicDetails = (account: any) => {
  return {
    username: account.username,
    displayName: account.display_name,
    profilePictureURL: account.profile_picture_url,
    boards: serializeBoards(account.boards),
    backgroundPictureURL: account.background_picture_url,
    description: account.description,
  };
};

export const serializeAccountPrivateDetails = (account: any) => {
  return {
    ...serializeAccountPublicDetails(account),
    type: account.type,
    initial: account.initial,
  };
};

export const serializeBoard = (board: any) => {
  return {
    id: board.unique_id,
    title: board.title,
    coverPictureURL: board.cover_picture_url,
  };
};

export const serializeBoards = (boards: any) => {
  return boards.map(serializeBoard);
};
