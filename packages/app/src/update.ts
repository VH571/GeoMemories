import { Msg } from "./messages";
import { Model } from "./model";
import { Auth, Update } from "@calpoly/mustang";
import type { User } from "server/models";

export default function update(
  msg: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (msg[0]) {
    case "profile/select":
      fetch(`/api/users/${msg[1].userid}`, {
        headers: Auth.headers(user)
      })
        .then(res => res.ok ? res.json() : undefined)
        .then(profile => profile && apply(model => ({ ...model, profile })));
      break;

    case "posts/load":
      fetch("/api/posts", {
        headers: Auth.headers(user)
      })
        .then(res => res.ok ? res.json() : [])
        .then(posts => apply(model => ({ ...model, posts })));
      break;

    case "locations/load":
      fetch("/api/locations", {
        headers: Auth.headers(user)
      })
        .then(res => res.ok ? res.json() : [])
        .then(locations => apply(model => ({ ...model, locations })));
      break;

    case "profile/save":
      saveProfile(msg[1], user)
        .then(profile => apply(model => ({ ...model, profile })))
        .then(() => msg[1].onSuccess?.())
        .catch(err => msg[1].onFailure?.(err));
      break;

    default:
      const unhandled: never = msg[0];
      throw new Error(`Unhandled message: ${unhandled}`);
  }
}

function saveProfile(
  msg: {
    userid: string;
    profile: User;
  },
  user: Auth.User
): Promise<User> {
  return fetch(`/api/users/${msg.userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.profile)
  }).then(res => {
    if (res.status === 200) return res.json();
    throw new Error(`Failed to save profile for ${msg.userid}`);
  });
}
