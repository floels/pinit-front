export type Pin = {
  id: string;
  title: string;
  imageURL: string;
  authorUsername?: string;
  authorDisplayName?: string;
  authorProfilePictureURL?: string;
  description?: string;
};

export enum TypesOfAccount {
  PERSONAL = "personal",
  BUSINESS = "business",
}

export type AccountPublicDetails = {
  type: TypesOfAccount;
  username: string;
  displayName: string;
  profilePictureURL: string | null;
  backgroundPictureURL: string | null;
  description: string | null;
};

export type AccountPrivateDetails = {
  type: TypesOfAccount;
  username: string;
  displayName: string;
  initial: string;
  profilePictureURL: string | null;
  ownerEmail: string;
  boards: Board[];
};

export type Board = {
  title: string;
  coverPictureURL: string | null;
};
