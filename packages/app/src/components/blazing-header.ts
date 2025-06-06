import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { Auth, Events, Observer } from "@calpoly/mustang";

@customElement("blazing-header")
export class BlazingHeader extends LitElement {
  static styles = css`
    header {
      background: #444;
      color: white;
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
      color: white;
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

  private _authObserver = new Observer<Auth.Model>(this, "geomem:auth");

  @state() loggedIn = false;
  @state() userid?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth) => {
      const { user } = auth;
      if (user?.authenticated) {
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

  toggleDarkMode(e: Event) {
    const target = e.target as HTMLInputElement;
    const customEvent = new CustomEvent("darkmode:toggle", {
      bubbles: true,
      detail: { enabled: target.checked }
    });
    this.dispatchEvent(customEvent);
  }

  render() {
    return html`
      <header>
        <div class="site-title"><h1>GeoMemories</h1></div>
        <div class="nav-container">
          <nav>
            <a href="/app"><h2>Home</h2></a>
            <a href="/app/posts"><h2>Posts</h2></a>
            <a href="/app/new"><h2>New</h2></a>
            <a href="/app/map"><h2>Map</h2></a>
          </nav>

          <label>
            <input
              type="checkbox"
              @change=${this.toggleDarkMode}
              autocomplete="off"
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
              : html`<a href="/login">Sign In…</a>`}
          </div>
        </div>
      </header>
    `;
  }

  createRenderRoot() {
    return this;
  }
}
