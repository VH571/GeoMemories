import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/login-form";

@customElement("login-view")
export class LoginViewElement extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-family: "Poppins", sans-serif;
    }

    .container {
      max-width: 392px;
      width: 100%;
      padding: 27px 26px;
      box-sizing: border-box;
      border-radius: 12px;
    }

    .title {
      font-size: 40px;
      font-family: "Rammetto One", cursive;
      font-weight: 400;
      text-align: center;
      margin: 0 0 24px 0;
      line-height: 1.2;
    }

    .subtitle {
      text-align: center;
      font-size: 14px;
      font-family: "Livvic", sans-serif;
      font-weight: 400;
      opacity: 0.67;
      margin-bottom: 25px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-input {
      width: 100%;
      height: 72px;
      background: white;
      border: 1px solid #eeeeee;
      border-radius: 20px;
      padding: 0 19px;
      font-size: 14px;
      font-weight: 500;
      color: #1a1b23;
      box-sizing: border-box;
    }

    .form-input::placeholder {
      color: #c4c3c3;
      font-weight: 400;
    }

    .form-input:focus {
      border-color: #606c38;
    }

    .signup-link {
      text-align: center;
      font-size: 12px;
    }

    .signup-link span {
      color: #818181;
      font-weight: 400;
    }

    .signup-link a {
      color: #606c38;
      font-weight: 500;
      text-decoration: underline;
      margin-left: 4px;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h1 class="title">Login</h1>
        <p class="subtitle">Good to see you again! Let's explore.</p>

        <login-form api="/auth" redirect="/app">
          <div class="form-group">
            <input
              name="username"
              type="text"
              class="form-input"
              placeholder="Enter your username"
            />
          </div>

          <div class="form-group">
            <input
              name="password"
              type="password"
              class="form-input"
              placeholder="Enter your password"
            />
          </div>
        </login-form>

        <div class="signup-link">
          <span>Don't have account? Let's</span>
          <a href="/register">Sign up</a>
        </div>
      </div>
    `;
  }
}
