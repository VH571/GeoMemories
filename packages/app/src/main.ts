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
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "geomem:history", "geomem:auth");
    }
  },
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      super(update, init, "geomem:auth");
    }
  },
  "profile-view": ProfileViewElement,
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
