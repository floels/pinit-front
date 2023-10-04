export const getPinSuggestionsWithCamelizedKeys =
  (fetchInitialPinSuggestionsData: { results: any[] }) => {
    return fetchInitialPinSuggestionsData.results.map((pinSuggestion) => ({
      id: pinSuggestion.id,
      imageURL: pinSuggestion.image_url,
      title: pinSuggestion.title,
      description: pinSuggestion.description,
      authorUsername: pinSuggestion.author.user_name,
      authorDisplayName: pinSuggestion.author.display_name,
    }));
  };
