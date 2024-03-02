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

export type Account = {
  username: string;
  displayName: string;
  profilePictureURL: string | null;
  boards: Board[];
  initial: string;
  backgroundPictureURL: string | null;
  description: string | null;
};

export type AccountWithPrivateDetails = Account & {
  type: TypesOfAccount;
  ownerEmail: string;
};

export type Board = {
  id: string;
  title: string;
  coverPictureURL: string | null;
};
