import {
  Account,
  AccountWithPrivateDetails,
  AccountWithPublicDetails,
  Board,
  BoardWithBasicDetails,
  BoardWithFullDetails,
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
    author: serializeAccount(pin.author),
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

const serializeAccount = (account: any): Account => {
  return {
    username: account.username,
    displayName: account.display_name,
    initial: account.initial,
    profilePictureURL: account.profile_picture_url,
  };
};

export const serializeAccountWithPublicDetails = (
  account: any,
): AccountWithPublicDetails => {
  return {
    ...serializeAccount(account),
    boards: serializeBoardsWithBasicDetails(account.boards),
    backgroundPictureURL: account.background_picture_url,
    description: account.description,
  };
};

export const serializeAccountWithPrivateDetails = (
  account: any,
): AccountWithPrivateDetails => {
  return {
    ...serializeAccountWithPublicDetails(account),
    type: account.type,
    ownerEmail: account.owner_email,
  };
};

const serializeBoard = (board: any): Board => {
  return {
    id: board.unique_id,
    name: board.name,
    slug: board.slug,
  };
};

export const serializeBoardWithBasicDetails = (
  board: any,
): BoardWithBasicDetails => {
  return {
    ...serializeBoard(board),
    firstImageURLs: board.first_image_urls,
  };
};

export const serializeBoardsWithBasicDetails = (
  boards: any,
): BoardWithBasicDetails[] => {
  return boards.map(serializeBoardWithBasicDetails);
};

export const serializeBoardWithFullDetails = (
  board: any,
): BoardWithFullDetails => {
  return {
    ...serializeBoard(board),
    author: serializeAccount(board.author),
    pins: serializePinsWithAuthorDetails(board.pins),
  };
};
