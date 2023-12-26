// API routes
export const API_ROUTE_SIGN_UP = "/api/user/sign-up";
export const API_ROUTE_OBTAIN_TOKEN = "/api/user/obtain-token";
export const API_ROUTE_REFRESH_TOKEN = "/api/user/refresh-token";
export const API_ROUTE_OWNED_ACCOUNTS = "/api/user/owned-accounts";
export const API_ROUTE_PINS_SUGGESTIONS = "/api/pin-suggestions";
export const API_ROUTE_PINS_SEARCH = "/api/pins/search";
export const API_ROUTE_PINS_SEARCH_AUTOCOMPLETE =
  "/api/pins/search/autocomplete";
export const API_ROUTE_CREATE_PIN = "/api/create-pin";
export const API_ROUTE_LOG_OUT = "/api/user/log-out";

// API base URL and endpoints
export const API_BASE_URL = "http://127.0.0.1:8000/api";
export const API_ENDPOINT_OBTAIN_TOKEN = "token/obtain";
export const API_ENDPOINT_REFRESH_TOKEN = "token/refresh";
export const API_ENDPOINT_SIGN_UP = "signup";
export const API_ENDPOINT_GET_PIN_SUGGESTIONS = "pin-suggestions";
export const API_ENDPOINT_SEARCH_AUTOCOMPLETE = "search/autocomplete";
export const API_ENDPOINT_SEARCH_PINS = "search";
export const API_ENDPOINT_PIN_DETAILS = "pins";
export const API_ENDPOINT_ACCOUNT_DETAILS = "accounts";
export const API_ENDPOINT_OWNED_ACCOUNTS = "owned-accounts";
export const API_ENDPOINT_CREATE_PIN = "create-pin";

// API error codes
export const ERROR_CODE_UNAUTHORIZED = "unauthorized";
export const ERROR_CODE_INVALID_REFRESH_TOKEN = "invalid_refresh_token";
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
