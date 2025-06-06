import { Msg } from "./messages";
import { Model } from "./model";
import { Auth, Update } from "@calpoly/mustang";

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
  }
}
