import { User, Post, Location } from "server/models";

export interface Model {
  profile?: User;
  posts?: Post[];
  locations?: Location[];
}

export const init: Model = {};
