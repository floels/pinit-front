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

  // Check if the date string is not the same date as parsed date (to catch cases like 2020-02-31)
  if (dateObject.toISOString().substring(0, 10) !== input) {
    return false;
  }

  if (dateObject > dateNow) {
    return false;
  }

  return true;
};
