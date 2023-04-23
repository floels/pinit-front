import Cookies from "js-cookie";
import { Dispatch } from "react";
import { Action } from "../app/globalState";

export const isValidEmail = (input: string) => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input);
};

export const isValidPassword = (input: string) => {
  return input.length >= 6;
};

export const isValidBirthdate = (input: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(input)) {
    return false;
  }

  const dateObject = new Date(input);
  const dateNow = new Date();

  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();

  const inputYear = parseInt(input.slice(0, 4));
  const inputMonth = parseInt(input.slice(5, 7));
  const inputDay = parseInt(input.slice(8, 10));

  const dateObjectMatchesInputs =
    year === inputYear && month === inputMonth && day === inputDay;

  return dateObjectMatchesInputs && year > 1880 && dateObject < dateNow;
};

export const fetchWithAuthentication = async (
  url: string,
  globalStateDispatch: Dispatch<Action>,
  options: RequestInit = {}
) => {
  const accessToken = Cookies.get("accessToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401) {
    // Access token is invalid
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    globalStateDispatch({ type: "SET_IS_AUTHENTICATED", payload: false });
  }

  return response;
};
