import { ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY } from "../constants";

export const setAccessTokenExpirationDate = (expirationDate: string) => {
  if (!window?.localStorage) {
    return;
  }

  localStorage.setItem(
    ACCESS_TOKEN_EXPIRATION_DATE_LOCAL_STORAGE_KEY,
    expirationDate,
  );
};
