export type PinType = {
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

export type AccountType = {
  type: TypesOfAccount;
  username: string;
  displayName: string;
  initial: string;
  profilePictureURL?: string;
  ownerEmail: string;
};
