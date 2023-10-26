// API route
export const API_ROUTE_PINS_SUGGESTIONS = "/api/pins/suggestions";
export const API_ROUTE_PINS_SEARCH = "/api/pins/search";

// API base URL and endpoints
export const API_BASE_URL = "http://127.0.0.1:8000/api";
export const API_ENDPOINT_OBTAIN_TOKEN = "token/obtain";
export const API_ENDPOINT_REFRESH_TOKEN = "token/refresh";
export const API_ENDPOINT_SIGN_UP = "signup";
export const API_ENDPOINT_GET_PIN_SUGGESTIONS = "pins/suggestions";
export const API_ENDPOINT_SEARCH_AUTOCOMPLETE = "search/autocomplete";
export const API_ENDPOINT_SEARCH_PINS = "search";
export const API_ENDPOINT_PIN_DETAILS = "pins";

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
export const ERROR_CODE_MISSING_ACCESS_TOKEN = "missing_access_token";
