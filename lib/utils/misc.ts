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

export const appendQueryParam = (url: string, key: string, value: string) => {
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
};
