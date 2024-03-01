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
  username: string;
  type: TypesOfAccount;
  displayName: string;
  initial: string;
  profilePictureURL: string | null;
  boards: Board[];
};

export type Board = {
  id: string;
  title: string;
  coverPictureURL: string | null;
};
