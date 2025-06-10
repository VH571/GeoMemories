import { User, Post, Location } from "server/models";

export interface Model {
  
  user?: User;
  token?: string;
  profile?: User;
  posts?: Post[];
  locations?: Location[];
}
export interface AuthModel {
  user: {
    authenticated: boolean;
    username: string;
  };
  token?: string;
}

export const init: Model = {};
