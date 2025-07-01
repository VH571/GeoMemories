import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import * as API from "./services/api";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  console.log("MESSAGE RECEIVED:", message);

  switch (message[0]) {
    case "cert/success": {
      console.log("PROFILE RECEIVED:", message[1].user);
      const { token, user: authUser } = message[1];
      apply((model) => ({ ...model, token, authUser }));
      break;
    }

    case "cert/logout": {
      apply(() => ({}));
      break;
    }

    case "profile/select": {
      const { userid } = message[1];
      API.fetchProfile(userid, user)
        .then((profile) => apply((m) => ({ ...m, profile })))
        .catch((err) => console.warn("Profile load failed:", err));
      break;
    }

    case "profile/save": {
      const { userid, profile, onSuccess, onFailure } = message[1];
      API.saveProfile(userid, profile, user)
        .then((updated) => {
          apply((m) => ({ ...m, profile: updated }));
          onSuccess?.();
        })
        .catch((err) => {
          onFailure?.(err);
        });
      break;
    }

    case "posts/load": {
      API.fetchPosts(user).then((posts) => apply((m) => ({ ...m, posts })));
      break;
    }

    case "locations/load": {
      API.fetchLocations(user).then((locations) =>
        apply((m) => ({ ...m, locations }))
      );
      break;
    }

    default:
      console.warn("Unhandled message:", message[0]);
  }
}
