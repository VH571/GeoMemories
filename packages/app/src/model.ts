import { User, Post, Location } from "server/models";

export interface Model {
  authUser ?: User; //authenticated user profile signed in
  token?: string; //authenticated token
  profile?: User; //fetches all posts from the server
  posts?: Post[]; //fetched a user profile
  locations?: Location[]; //fetches all locations from the server.
}

export const init: Model = {};