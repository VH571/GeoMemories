import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/register-form";

@customElement("register-view")
export class RegisterViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      max-width: 400px;
      margin: auto;
    }
  `;

  render() {
    return html`
      <h2>Sign Up</h2>
      <register-form api="/auth/register" redirect="/app">
        <label>
          Username:
          <input name="username" type="text" />
        </label>
        <label>
          Password:
          <input name="password" type="password" />
        </label>
      </register-form>
      <p>Already have an account? <a href="/login">Login here</a>.</p>
    `;
  }
}
