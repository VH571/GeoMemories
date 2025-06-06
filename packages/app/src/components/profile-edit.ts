import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { define, View, History, Form } from "@calpoly/mustang";
import type { Model } from "../model";
import type { Msg } from "../messages";
import type { User } from "server/models";

export class ProfileEditElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element
  });

  @property()
  userid = "";

  @state()
  get profile(): User | undefined {
    return this.model.profile;
  }

  override render() {
  return html`
    <h2>Edit Profile</h2>
    <mu-form
      .init=${this.profile}
      @mu-form:submit=${this.handleSubmit}>
      <label>First Name: <input name="firstName" /></label>
      <label>Last Name: <input name="lastName" /></label>
      <label>Username: <input name="username" /></label>
      <label>Password: <input name="password" type="password" /></label>
      <button slot="button" type="submit">Save</button>
    </mu-form>
  `;
}


  handleSubmit(event: Form.SubmitEvent<User>) {
    this.dispatchMessage([
      "profile/save",
      {
        userid: this.userid,
        profile: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/profile/${this.userid}`
          }),
        onFailure: (err: Error) =>
          console.error("Error saving profile:", err)
      }
    ]);
  }
}
