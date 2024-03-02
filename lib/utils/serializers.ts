import {
  AccountWithPrivateDetails,
  Account,
  Board,
  PinWithAuthorDetails,
  PinWithFullDetails,
} from "../types";

export const serializePinWithAuthorDetails = (
  pin: any,
): PinWithAuthorDetails => {
  return {
    id: pin.unique_id,
    title: pin.title,
    imageURL: pin.image_url,
    authorUsername: pin.author.username,
    authorDisplayName: pin.author.display_name,
    authorProfilePictureURL: pin.author.profile_picture_url,
  };
};

export const serializePinsWithAuthorDetails = (
  pins: any,
): PinWithAuthorDetails[] => {
  return pins.map(serializePinWithAuthorDetails);
};

export const serializePinWithFullDetails = (pin: any): PinWithFullDetails => {
  return {
    ...serializePinWithAuthorDetails(pin),
    description: pin.description,
  };
};

export const serializeAccount = (account: any): Account => {
  return {
    username: account.username,
    displayName: account.display_name,
    profilePictureURL: account.profile_picture_url,
    initial: account.initial,
    boards: serializeBoards(account.boards),
    backgroundPictureURL: account.background_picture_url,
    description: account.description,
  };
};

export const serializeAccountWithPrivateDetails = (
  account: any,
): AccountWithPrivateDetails => {
  return {
    ...serializeAccount(account),
    type: account.type,
    ownerEmail: account.owner_email,
  };
};

export const serializeBoard = (board: any): Board => {
  return {
    id: board.unique_id,
    title: board.title,
    coverPictureURL: board.cover_picture_url,
  };
};

export const serializeBoards = (boards: any): Board[] => {
  return boards.map(serializeBoard);
};
