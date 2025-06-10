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
      height: 60vh;
      font-family: "Poppins", sans-serif;
    }

    .container {
      max-width: 392px;
      width: 100%;
      padding: 27px 26px;
      box-sizing: border-box;
      border-radius: 12px;
    }

    .logo {
      width: 47px;
      height: 47px;
      background: #606c38;
      border-radius: 4px;
      margin-bottom: 48px;
      position: relative;
    }

    .logo::after {
      content: "";
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 19px;
      height: 8px;
      border: 2px solid white;
      border-radius: 2px;
    }

    .title {
      font-size: 40px;
      font-family: "Rammetto One", cursive;
      font-weight: 400;
      color: #1d1d20;
      text-align: center;
      margin: 0 0 24px 0;
      line-height: 1.2;
    }

    .subtitle {
      text-align: center;
      color: #4a4a4a;
      font-size: 14px;
      font-family: "Livvic", sans-serif;
      font-weight: 400;
      opacity: 0.67;
      margin-bottom: 25px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      color: #606c38;
      font-size: 12px;
      font-weight: 400;
      margin-bottom: 8px;
      padding-left: 19px;
    }

    .form-input {
      width: 100%;
      height: 72px;
      background: white;
      border: 1px solid #eeeeee;
      border-radius: 0;
      padding: 0 19px;
      font-size: 14px;
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      color: #1a1b23;
      box-sizing: border-box;
      outline: none;
    }

    .form-input::placeholder {
      color: #c4c3c3;
      font-weight: 400;
    }

    .form-input:focus {
      border-color: #606c38;
    }

    .forgot-password {
      text-align: left;
      margin: 20px 0 40px 0;
    }

    .forgot-password a {
      color: #606c38;
      font-size: 12px;
      font-weight: 400;
      text-decoration: underline;
    }

    .signin-button {
      width: 100%;
      height: 61px;
      background: #606c38;
      border: none;
      border-radius: 0;
      color: white;
      font-size: 14px;
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 30px;
    }

    .signin-button:hover {
      background: #505a30;
    }

    .divider {
      text-align: center;
      color: #818181;
      font-size: 12px;
      font-weight: 500;
      margin: 30px 0;
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
