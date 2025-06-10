import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface RegisterFormData {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  profilePicture?: string; // base64 string
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

  handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (this.canSubmit && this.api) {
      fetch(this.api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formData),
      })
        .then((res) => {
          if (res.status !== 201) throw new Error("Registration failed");
          return res.json();
        })
        .then((json: { token: string }) => {
          this.dispatchEvent(
            new CustomEvent("auth:message", {
              bubbles: true,
              composed: true,
              detail: [
                "auth/signin",
                { token: json.token, redirect: this.redirect },
              ],
            })
          );
        })
        .catch((err: Error) => {
          console.error(err);
          this.error = err.toString();
        });
    }
  }
}
