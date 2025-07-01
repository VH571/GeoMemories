import { Auth } from "@calpoly/mustang";
import { User, Post, Location } from "server/models";

export function fetchProfile(userid: string, user: Auth.User): Promise<User> {
  return fetch(`/api/users/${userid}`, {
    headers: Auth.headers(user),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to load profile");
    return res.json();
  });
}

export function saveProfile(
  userid: string,
  profile: User,
  user: Auth.User
): Promise<User> {
  return fetch(`/api/users/${userid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user),
    },
    body: JSON.stringify(profile),
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to save profile");
    return res.json();
  });
}

export function fetchPosts(user: Auth.User): Promise<Post[]> {
  return fetch("/api/posts", {
    headers: Auth.headers(user),
  }).then((res) => res.ok ? res.json() : []);
}

export function fetchLocations(user: Auth.User): Promise<Location[]> {
  return fetch("/api/locations", {
    headers: Auth.headers(user),
  }).then((res) => res.ok ? res.json() : []);
}
