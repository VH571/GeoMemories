import { User  } from "server/models";

export type Msg =
  | [
      "profile/save",
      {
        userid: string;
        profile: User ;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | ["profile/select", { userid: string }]
  | ["posts/load", {}]
  | ["locations/load", {}];
