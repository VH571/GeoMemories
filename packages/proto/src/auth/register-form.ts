import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.js";
import headings from "../styles/reset.css.js";

interface RegisterFormData {
  username?: string;
  password?: string;
}

export class RegisterFormElement extends LitElement {
  @state() formData: RegisterFormData = {};
  @property() api?: string;
  @property() redirect: string = "/login.html";
  @state() error?: string;

  get canSubmit(): boolean {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button type="submit" ?disabled=${!this.canSubmit}>Register</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  static styles = [
    reset.styles,
    headings.styles,
    css`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `
  ];

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
    }
  }

  handleSubmit(submitEvent: SubmitEvent) {
  submitEvent.preventDefault();

  if (this.canSubmit) {
    fetch(this.api || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.formData)
    })
      .then((res) => {
        if (res.status !== 201) throw new Error("Registration failed");
        return res.json();
      })
      .then((json: { token: string }) => {
        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token: json.token, redirect: this.redirect }]
        });
        console.log("dispatching registration message", customEvent);
        this.dispatchEvent(customEvent);
      })
      .catch((error: Error) => {
        console.log(error);
        this.error = error.toString();
      });
  }
}

}
