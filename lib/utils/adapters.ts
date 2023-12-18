export const getPinWithCamelizedKeys = (pin: any) => {
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

export const getPinsWithCamelizedKeys = (pins: any[]) => {
  return pins.map(getPinWithCamelizedKeys);
};

const getAccountWithCamelizedKeys = (account: any) => {
  return {
    type: account.type,
    username: account.username,
    displayName: account.display_name,
    initial: account.initial,
    profilePictureURL: account.profile_picture_url,
  };
};

export const getAccountsWithCamelizedKeys = (accounts: any[]) => {
  return accounts.map(getAccountWithCamelizedKeys);
};
