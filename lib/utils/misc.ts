export const getPinThumbnailsWithCamelizedKeys =
  (fetchPinThumbnailsResponseData: { results: any[] }) => {
    return fetchPinThumbnailsResponseData.results.map((pinThumbnail) => ({
      id: pinThumbnail.id,
      imageURL: pinThumbnail.image_url,
      title: pinThumbnail.title,
      description: pinThumbnail.description,
      authorUsername: pinThumbnail.author.user_name,
      authorDisplayName: pinThumbnail.author.display_name,
    }));
  };

export const appendQueryParam = (url: string, key: string, value: string) => {
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
};
