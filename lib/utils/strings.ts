export const appendQueryParam = ({
  url,
  key,
  value,
}: {
  url: string;
  key: string;
  value: string;
}) => {
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${key}=${encodeURIComponent(value)}`;
};
