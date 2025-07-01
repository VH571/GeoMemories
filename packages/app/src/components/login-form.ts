import { Message } from "@calpoly/mustang";
import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state() formData: LoginFormData = {};
  @property() api?: string;
  @property() redirect: string = "/";
  @state() error?: string;

  get canSubmit() {
    return this.formData.username && this.formData.password;
  }

  static styles = css`
    .error:not(:empty) {
      color: red;
      margin-top: 0.5rem;
    }
    button[type="submit"] {
      width: 100%;
      height: 61px;
      background: #606c38;
      border: none;
      border-radius: 20px;
      color: white;
      font-size: 14px;
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 15px;
      transition: background-color 0.2s ease;
    }
  `;

  render() {
    return html`
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Sign in</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.formData = { ...this.formData, [target.name]: target.value };
  }

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (!this.canSubmit || !this.api) return;

    try {
      // login
      const res = await fetch(`${this.api}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Login failed");
      }

      const { token } = await res.json();

      //fetch user profile
      const profileRes = await fetch(`${this.api}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profile = await profileRes.json();

      //dispatch to mu-auth
      const muAuth = document.querySelector("mu-auth");
      if (muAuth) {
        muAuth.dispatchEvent(
          new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: [
              "auth/signin",
              {
                token: token,
                authenticated: true,
                username: profile.username,
                redirect: this.redirect,
              },
            ],
          })
        );
      }
      // Dispatch to <mu-store>
      console.log("this is the profile: ", profile)
      this.dispatchEvent(
        new CustomEvent("login-success", {
          bubbles: true,
          composed: true,
          detail: {
            token,
            profile,
            redirect: this.redirect,
          },
        })
      );

      console.log("Login successful:", profile);
      this.formData = {};
      this.error = undefined;
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
