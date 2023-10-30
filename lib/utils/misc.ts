export const getPinsWithCamelizedKeys = (fetchPinsResponseData: {
  results: any[];
}) => {
  return fetchPinsResponseData.results.map((pin) => ({
    id: pin.unique_id,
    imageURL: pin.image_url,
    title: pin.title,
    description: pin.description,
    authorUsername: pin.author.user_name,
    authorDisplayName: pin.author.display_name,
  }));
};

export const appendQueryParam = (url: string, key: string, value: string) => {
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
};
