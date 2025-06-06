import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/login-form";

@customElement("login-view")
export class LoginViewElement extends LitElement {
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
      <h2>Login In</h2>
      <login-form api="/auth/login" redirect="/app">
        <label>
          Username:
          <input name="username" type="text" />
        </label>
        <label>
          Password:
          <input name="password" type="password" />
        </label>
      </login-form>
      <p>Don't have an account? <a href="/register">Register here</a>.</p>
    `;
  }
}
