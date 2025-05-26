import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Auth, Events, Observer } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  static styles = css`
    header {
      background-color: var(--color-background-header);
      color: var(--color-text-header);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    nav {
      display: flex;
      gap: 1rem;
    }

    nav a {
      color: var(--color-text-header);
      text-decoration: none;
    }

    nav a:hover {
      text-decoration: underline;
    }

    label {
      font-size: 0.9rem;
      display: flex;
      align-items: center;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  `;

  static initializeOnce() {
    customElements.define("site-header", HeaderElement);
  }

  private _authObserver = new Observer<Auth.Model>(this, "geo:auth");

  @state() loggedIn = false;
  @state() userid?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth) => {
      const { user } = auth;
      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });

    document.body.addEventListener("darkmode:toggle", (event: any) => {
      const enabled = event.detail.enabled;
      document.body.classList.toggle("dark-mode", enabled);
    });
  }

  render() {
    return html`
      <header>
        <div class="site-title"><h1>Geo-Memories</h1></div>
        <div class="nav-container">
          <nav>
            <a href="index.html"><h2>Home</h2></a>
            <a href="location-yosemite.html"><h2>Locations</h2></a>
          </nav>

          <label id="dark-mode-toggle">
            <input
              type="checkbox"
              autocomplete="off"
              @change=${this.toggleDarkMode}
            />
            Dark mode
          </label>

          <div class="auth-section">
            ${this.loggedIn
              ? html`
                  <span>Hello, ${this.userid}</span>
                  <button
                    @click=${(e: Event) =>
                      Events.relay(e, "auth:message", ["auth/signout"])}
                  >
                    Sign Out
                  </button>
                `
              : html`<a href="/login.html">Sign In…</a>`}
          </div>
        </div>
      </header>
    `;
  }

  toggleDarkMode(e: Event) {
    const target = e.target as HTMLInputElement;
    const customEvent = new CustomEvent("darkmode:toggle", {
      bubbles: true,
      detail: { enabled: target.checked },
    });
    this.dispatchEvent(customEvent);
  }

  createRenderRoot() {
    return this;
  }
}
