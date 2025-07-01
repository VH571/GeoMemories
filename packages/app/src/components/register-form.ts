import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface RegisterFormData {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  profilePicture?: string;
}

export class RegisterFormElement extends LitElement {
  @state() formData: RegisterFormData = {};
  @property() api?: string;
  @property() redirect: string = "/login";
  @state() error?: string;

  get canSubmit(): boolean {
    const { firstName, lastName, username, password } = this.formData;
    return Boolean(this.api && firstName && lastName && username && password);
  }

  static styles = css`
    .error:not(:empty) {
      color: red;
      font-size: 14px;
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
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 15px;
    }
  `;

  override render() {
    return html`
      <form @input=${this.handleChange} @submit=${this.handleSubmit}>
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Sign Up</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  handleChange(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    const name = target.name;

    if (target.type === "file" && target.files?.[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.formData = {
          ...this.formData,
          profilePicture: reader.result as string,
        };
      };
      reader.readAsDataURL(file);
    } else {
      this.formData = {
        ...this.formData,
        [name]: target.value,
      };
    }
  }

  async handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!this.canSubmit || !this.api) return;

    try {
      const res = await fetch(this.api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formData),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Registration failed");
      }

      const { token } = await res.json();

      // Fetch the user profile using the token
      const profileRes = await fetch(`${this.api}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile after registration");
      }

      const profile = await profileRes.json();

      // Dispatch to <mu-auth>
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

      console.log("Registration + login successful:", profile);
      this.formData = {};
      this.error = undefined;
    } catch (err: any) {
      console.error(err);
      this.error = err.message;
    }
  }
}
