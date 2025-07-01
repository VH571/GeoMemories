import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("profile-view")
export class ProfileViewElement extends LitElement {
  @property({ type: String }) userid = "";
  @state() user: any = null;

  async connectedCallback() {
    super.connectedCallback();
    if (this.userid) {
      try {
        const res = await fetch(`/api/users/${this.userid}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        this.user = await res.json();
      } catch (err) {
        console.error(" Error fetching user:", err);
      }
    }
  }

  render() {
    if (!this.user) {
      return html`<p>
        Loading profile for <strong>${this.userid}</strong>...
      </p>`;
    }

    return html`
      <h1>${this.user.firstName} ${this.user.lastName}</h1>
      <p>Username: ${this.user.username}</p>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      color: var(--color-text);
      background-color: var(--color-background-page);
      font-family: var(--font-family-base);
    }

    .container-post {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }

    h2 {
      color: var(--color-text);
      font-family: var(--font-family-display);
    }
  `;
}
