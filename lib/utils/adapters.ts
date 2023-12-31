export const getPinWithCamelCaseKeys = (pin: any) => {
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

export const getPinsWithCamelCaseKeys = (pins: any[]) => {
  return pins.map(getPinWithCamelCaseKeys);
};

export const getAccountWithCamelCaseKeys = (account: any) => {
  return {
    type: account.type,
    username: account.username,
    displayName: account.display_name,
    initial: account.initial,
    profilePictureURL: account.profile_picture_url,
    backgroundPictureURL: account.background_picture_url,
    ownerEmail: account.owner_email,
    description: account.description,
  };
};

export const getAccountsWithCamelCaseKeys = (accounts: any[]) => {
  return accounts.map(getAccountWithCamelCaseKeys);
};
