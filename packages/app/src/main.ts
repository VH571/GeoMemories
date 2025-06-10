import { Auth, define, History, Switch, Store } from "@calpoly/mustang";
import { html } from "lit";
import { BlazingHeader as HeaderElement } from "./components/blazing-header";
import { HomeViewElement } from "./views/home-view";
import { PostsViewElement } from "./views/posts-view";
import { NewPostViewElement } from "./views/new-post-view";
import { MapViewElement } from "./views/map-view";
import { LoginViewElement } from "./views/login-view";
import { RegisterViewElement } from "./views/register-view";
import { LoginFormElement } from "./components/login-form";
import { RegisterFormElement } from "./components/register-form";
import { ProfileViewElement } from "./views/profile-view";
import { ProfileEditElement } from "./components/profile-edit";
import { Model, init } from "./model";
import { Msg } from "./messages";
import update from "./update";

const routes: any[] = [
  { path: "/login", view: () => html`<login-view></login-view>` },
  { path: "/register", view: () => html`<register-view></register-view>` },
  { path: "/app/posts", view: () => html`<posts-view></posts-view>` },
  { path: "/app/new", view: () => html`<new-post-view></new-post-view>` },
  { path: "/app/map", view: () => html`<map-view></map-view>` },
  {
    path: "/profile/:userid/edit",
    view: (params: { userid: string }) =>
      html`<profile-edit userid="${params.userid}"></profile-edit>`,
  },
  {
    path: "/profile/:userid",
    view: (params: { userid: string }) => {
      console.log("Route params:", params);
      if (!params || !params.userid) {
        console.warn("Missing userid param", params);
        return html`<p>Error: Missing userid</p>`;
      }

      return html`<profile-view userid="${params.userid}"></profile-view>`;
    },
  },
  { path: "/app", view: () => html`<home-view></home-view>` },
  { path: "/", redirect: "/app" },
] as any;

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "geomem:model");
    }
  },
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "geomem:history", "geomem:auth");
    }
  },
  "profile-view": ProfileViewElement,
  "profile-edit": ProfileEditElement,
  "login-view": LoginViewElement,
  "register-view": RegisterViewElement,
  "login-form": LoginFormElement,
  "register-form": RegisterFormElement,
  "blazing-header": HeaderElement,
  "home-view": HomeViewElement,
  "posts-view": PostsViewElement,
  "new-post-view": NewPostViewElement,
  "map-view": MapViewElement,
});
customElements.whenDefined("mu-auth").then(() => {
  window.addEventListener("message", (event: Event) => {
    const messageEvent = event as MessageEvent;
    const { type, payload } = messageEvent.data;

    if (type === "auth/success") {
      console.log("Received auth/success, payload:", payload);

      const auth = document.querySelector("mu-auth");
      console.log("Found mu-auth element:", auth);

      if (auth) {
        const loginData = {
          authenticated: true,
          username: payload.username || payload.user?.username,
          token: payload.token,
        };

        console.log("Dispatching auth/login with:", loginData);

        auth.dispatchEvent(
          new CustomEvent("message", {
            bubbles: true,
            composed: true,
            detail: ["auth/login", loginData],
          })
        );
      }
    }
  });
});
