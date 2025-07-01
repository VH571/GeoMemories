import { User } from "server/models";

export type Msg =
  | ["cert/success", { token: string; user: User }] // Updates the store when the user has successfully logged in.
  | ["cert/logout"] // Clears user session data from the store.
  | ["profile/select", { userid: string }] // Fetches another user's profile
  | ["posts/load"] // Loads all posts from the server.
  | ["locations/load"] // Loads all location markers
  | [
      "profile/save",
      {
        userid: string;
        profile: User;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]; // Saves updated profile data for a user (this meant for a edit user profile feature)
