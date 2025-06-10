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
      border-radius: 0;
      color: white;
      font-size: 14px;
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 30px;
      transition: background-color 0.2s ease;
    }

    button[type="submit"]:hover:not(:disabled) {
      background: #505a30;
    }

    button[type="submit"]:disabled {
      background: #a0a0a0;
      cursor: not-allowed;
      opacity: 0.6;
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
      const res = await fetch(`${this.api}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData),
      });
      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Login failed");
      }
      const { token } = await res.json();
      const username = this.formData.username || "";
      const customEvent = new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: [
          "auth/signin",
          {
            token: token,
            username: username,
            redirect: this.redirect,
          },
        ],
      });
      this.dispatchEvent(customEvent);
      console.log("Dispatched auth/success with:", {
        token,
        username,
      });
      this.formData = {};
      this.error = undefined;
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
