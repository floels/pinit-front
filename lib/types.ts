type Pin = {
  id: string;
  title: string;
  imageURL: string;
};

export type PinWithAuthorDetails = Pin & {
  authorUsername: string;
  authorDisplayName: string;
  authorProfilePictureURL: string | null;
};

export type PinWithFullDetails = PinWithAuthorDetails & {
  description: string;
};

export enum TypesOfAccount {
  PERSONAL = "personal",
  BUSINESS = "business",
}

type Account = {
  username: string;
  displayName: string;
  profilePictureURL: string | null;
};

export type AccountWithPublicDetails = Account & {
  boards: BoardWithBasicDetails[];
  initial: string;
  backgroundPictureURL: string | null;
  description: string | null;
};

export type AccountWithPrivateDetails = AccountWithPublicDetails & {
  type: TypesOfAccount;
  ownerEmail: string;
};

export type Board = {
  id: string;
  name: string;
  slug: string;
};

export type BoardWithBasicDetails = Board & {
  firstImageURLs: string[];
};

export type BoardWithFullDetails = Board & {
  author: Account;
  pins: PinWithAuthorDetails[];
};
