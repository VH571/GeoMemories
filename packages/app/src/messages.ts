import { User } from "server/models";

export type Msg =
  | ["auth/success", { token: string; user: User }]
  | ["auth/logout"]
  | ["profile/select", { userid: string }]
  | ["posts/load"]
  | ["locations/load"]
  | [
      "profile/save",
      {
        userid: string;
        profile: User;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];
