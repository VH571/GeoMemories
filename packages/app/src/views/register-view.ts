import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/register-form";

@customElement("register-view")
export class RegisterViewElement extends LitElement {
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
      margin: 0 0 0px 0;
      line-height: 1.2;
    }

    .subtitle {
      text-align: center;
      font-size: 14px;
      font-family: "Livvic", sans-serif;
      font-weight: 400;
      opacity: 0.67;
      margin-top: 5px;
    }

    .form-container {
      width: 340px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 10px;
    }

    .form-input {
      width: 100%;
      height: 72px;
      background: white;
      border-radius: 20px;
      border: none;
      outline: 1px #eeeeee solid;
      outline-offset: -0.5px;
      padding: 0 20px;
      font-size: 14px;
      color: #1a1b23;
      box-sizing: border-box;
      margin-bottom: 10px;
    }

    .form-input::placeholder {
      color: rgba(0, 0, 0, 0.2);
      font-weight: 400;
    }

    .form-input:focus {
      outline-color: #606c38;
    }

    .avatar-upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .avatar-upload label {
      cursor: pointer;
      border: 3px dashed var(--color-accent, #bc6c25);
      border-radius: 50%;
      padding: 4px;
      transition: border-color 0.3s ease;
    }

    .avatar-upload label:hover {
      border-color: #a6541f;
    }

    .avatar-upload input[type="file"] {
      display: none;
    }

    .avatar {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 50%;
      display: block;
    }

    .upload-hint {
      font-size: 0.85rem;
      color: var(--color-text, #606c38);
      opacity: 0.8;
    }

    .login-link {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      margin-top: 10px;
    }

    .login-link span {
      color: #818181;
      font-size: 12px;
      font-weight: 400;
    }

    .login-link a {
      color: #606c38;
      font-size: 12px;
      font-weight: 500;
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h1 class="title">Sign Up</h1>
        <p class="subtitle">Ready to explore?<br />Sign up now!</p>

        <div class="form-container">
          <register-form api="/auth/register" redirect="/app">
            <div class="form-row">
              <input
                name="firstName"
                type="text"
                class="form-input"
                placeholder="First Name"
                required
              />
              <input
                name="lastName"
                type="text"
                class="form-input"
                placeholder="Last Name"
                required
              />
            </div>
            <input
              name="username"
              class="form-input"
              placeholder="Username"
              required
            />
            <input
              name="password"
              type="password"
              class="form-input"
              placeholder="Password"
              required
            />

            <div class="form-group">
              <div class="avatar-upload">
                <label for="profilePicture">
                  <img
                    id="preview"
                    class="avatar"
                    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                  />
                  <input
                    type="file"
                    name="profilePicture"
                    id="profilePicture"
                    accept="image/*"
                    @change=${this.handlePreview}
                  />
                </label>
                <span class="upload-hint">Upload Profile Picture</span>
              </div>

              <img id="preview" class="preview" />

              <img id="preview" class="preview" />
            </div>
          </register-form>

          <div class="login-link">
            <span>Already have an account?</span>
            <a href="/login">Login</a>
          </div>
        </div>
      </div>
    `;
  }

  handlePreview(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    const preview = this.shadowRoot?.getElementById(
      "preview"
    ) as HTMLImageElement;
    if (file && preview) {
      const reader = new FileReader();
      reader.onload = () => {
        preview.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
