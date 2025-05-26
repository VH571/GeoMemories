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
  `;

  render() {
    return html`
      <form @change=${this.handleChange} @submit=${this.handleSubmit}>
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.formData = { ...this.formData, [target.name]: target.value };
  }

 handleSubmit(event: SubmitEvent) {
  event.preventDefault();

  if (this.canSubmit) {
    fetch(this.api || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.formData)
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("Login failed");
        return res.json();
      })
      .then((json: { token: string }) => {
        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: [
            "auth/signin",
            { token: json.token, redirect: this.redirect }
          ]
        });
        this.dispatchEvent(customEvent);
      })
      .catch((err) => {
        console.error(err);
        this.error = err.toString();
      });
  }
}


}
