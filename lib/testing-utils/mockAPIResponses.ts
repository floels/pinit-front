import {
  API_ENDPOINT_ACCOUNT_DETAILS,
  API_ENDPOINT_PIN_DETAILS,
  API_ENDPOINT_SEARCH_PINS,
  API_ROUTE_CREATE_PIN,
  API_ROUTE_MY_ACCOUNT_DETAILS,
  API_ROUTE_OBTAIN_TOKEN,
  API_ROUTE_PIN_SUGGESTIONS,
  API_ROUTE_REFRESH_TOKEN,
  API_ROUTE_SAVE_PIN,
  API_ROUTE_SEARCH,
  API_ROUTE_SEARCH_SUGGESTIONS,
  API_ROUTE_SIGN_UP,
} from "../constants";
import { TypesOfAccount } from "../types";

export const MOCK_API_RESPONSES_JSON = {
  [API_ROUTE_SIGN_UP]: {
    access_token_expiration_utc: "2024-02-07T07:09:45+00:00",
  },
  [API_ROUTE_OBTAIN_TOKEN]: {
    access_token_expiration_utc: "2024-02-08T07:09:45+00:00",
  },
  [API_ROUTE_REFRESH_TOKEN]: {
    access_token_expiration_utc: "2024-02-09T07:09:45+00:00",
  },
  [API_ROUTE_PIN_SUGGESTIONS]: {
    results: Array.from({ length: 50 }, (_, index) => ({
      unique_id: String(index).padStart(18, "0"),
      image_url:
        "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      title: `Pin ${index + 1} title`,
      description: "",
      author: {
        user_name: "johndoe",
        display_name: "John Doe",
      },
    })),
  },
  [API_ROUTE_MY_ACCOUNT_DETAILS]: {
    username: "johndoe",
    display_name: "John Doe",
    profile_picture_url:
      "https://i.pinimg.com/564x/49/ce/d2/49ced2e29b6d4945a13be722bac54642.jpg",
    background_picture_url: null,
    description: null,
    boards: [
      {
        unique_id: "0000000000000000001",
        title: "Board 1 title",
        cover_picture_url:
          "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      },
      {
        unique_id: "0000000000000000002",
        title: "Board 2 title",
        cover_picture_url:
          "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      },
    ],
    type: "personal",
    initial: "J",
  },
  [API_ROUTE_SEARCH_SUGGESTIONS]: {
    results: [
      "foo suggestion 1",
      "foo suggestion 2",
      "foo suggestion 3",
      "foo suggestion 4",
      "foo suggestion 5",
      "foo suggestion 6",
    ],
  },
  [API_ROUTE_CREATE_PIN]: { unique_id: "0123456789012345" },
  [API_ROUTE_SAVE_PIN]: {
    board_id: "0000000000000000001",
    pin_id: "0000000000000000001",
  },

  [API_ENDPOINT_SEARCH_PINS]: {
    results: Array.from({ length: 50 }, (_, index) => ({
      unique_id: String(index).padStart(18, "0"),
      image_url:
        "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      title: `Pin ${index + 1} title`,
      description: "",
      author: {
        user_name: "johndoe",
        display_name: "John Doe",
      },
    })),
  },
  [API_ENDPOINT_PIN_DETAILS]: {
    unique_id: "0000000000000000001",
    image_url:
      "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
    title: "Pin title",
    description: "Pin description.",
    author: {
      user_name: "johndoe",
      display_name: "John Doe",
    },
  },
  [API_ENDPOINT_ACCOUNT_DETAILS]: {
    username: "johndoe",
    display_name: "John Doe",
    profile_picture_url:
      "https://i.pinimg.com/564x/49/ce/d2/49ced2e29b6d4945a13be722bac54642.jpg",
    background_picture_url: null,
    description: "Description for account of John Doe.",
    boards: [
      {
        unique_id: "0000000000000000001",
        title: "Board 1 title",
        cover_picture_url:
          "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      },
      {
        unique_id: "0000000000000000002",
        title: "Board 2 title",
        cover_picture_url:
          "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      },
    ],
  },
};

// NB: we don't use the serializers defined in
// 'lib/utils/serializers.ts' here because otherwise we wouldn't
// be able to detect in the tests if there is a bug in them.
export const MOCK_API_RESPONSES_SERIALIZED = {
  [API_ROUTE_MY_ACCOUNT_DETAILS]: {
    username: "johndoe",
    displayName: "John Doe",
    profilePictureURL:
      "https://i.pinimg.com/564x/49/ce/d2/49ced2e29b6d4945a13be722bac54642.jpg",
    backgroundPictureURL: null,
    description: null,
    boards: [
      {
        id: "0000000000000000001",
        title: "Board 1 title",
        coverPictureURL:
          "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      },
      {
        id: "0000000000000000002",
        title: "Board 2 title",
        coverPictureURL:
          "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      },
    ],
    type: TypesOfAccount.PERSONAL,
    initial: "J",
  },
  [API_ROUTE_PIN_SUGGESTIONS]: {
    results: Array.from({ length: 50 }, (_, index) => ({
      id: String(index).padStart(18, "0"),
      title: `Pin ${index} title`,
      imageURL:
        "https://i.pinimg.com/564x/fb/71/38/fb7138bb24bc5dabdaf3908a961cdfc6.jpg",
      authorUsername: "johndoe",
      authorDisplayName: "John Doe",
      authorProfilePictureURL:
        "https://i.pinimg.com/564x/49/ce/d2/49ced2e29b6d4945a13be722bac54642.jpg",
      description: "",
    })),
  },
};

export const MOCK_API_RESPONSES = Object.fromEntries(
  Object.entries(MOCK_API_RESPONSES_JSON).map(([key, value]) => [
    key,
    JSON.stringify(value),
  ]),
);
