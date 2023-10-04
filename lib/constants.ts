// API base URL and endpoints
export const API_BASE_URL = "http://127.0.0.1:8000/api";
export const ENDPOINT_OBTAIN_TOKEN = "token/obtain/";
export const ENDPOINT_REFRESH_TOKEN = "token/refresh/";
export const ENDPOINT_SIGN_UP = "signup/";
export const ENDPOINT_GET_ACCOUNTS = "accounts/";
export const ENDPOINT_GET_PIN_SUGGESTIONS = "pin-suggestions/";

// API error codes
export const ERROR_CODE_INVALID_EMAIL = "invalid_email";
export const ERROR_CODE_INVALID_PASSWORD = "invalid_password";
export const ERROR_CODE_INVALID_BIRTHDATE = "invalid_birthdate";
export const ERROR_CODE_EMAIL_ALREADY_SIGNED_UP = "email_already_signed_up";

// Frontend-only error codes
export const ERROR_CODE_CLIENT_FETCH_FAILED = "client_fetch_failed";
export const ERROR_CODE_FETCH_BACKEND_FAILED = "fetch_backend_failed";
export const ERROR_CODE_UNEXPECTED_SERVER_RESPONSE =
  "unexpected_server_response";
export const ERROR_CODE_REFRESH_TOKEN_FAILED = "refresh_token_failed";
