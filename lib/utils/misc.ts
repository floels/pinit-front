export const appendQueryParam = (url: string, key: string, value: string) => {
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
};
