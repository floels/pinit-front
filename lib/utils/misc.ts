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
