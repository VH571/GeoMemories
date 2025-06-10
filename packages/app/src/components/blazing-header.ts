import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { Auth, Events, Observer } from "@calpoly/mustang";

@customElement("blazing-header")
export class BlazingHeader extends LitElement {
  static styles = css`
    header {
      background: var(--color-background-header);
      color: var(--color-text-header);
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-accent);
      font-family: var(--font-family-base);
    }

    .site-title h1 {
      margin: 0;
      font-family: var(--font-family-display);
      font-size: 1.6rem;
      color: var(--color-accent);
    }

    .nav-container {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      text-decoration: none;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-header);
      font-size: 1rem;
      position: relative;
    }

    nav a::after {
      content: "";
      display: block;
      height: 2px;
      background: var(--color-accent);
      transform: scaleX(0);
      transition: transform 0.2s ease;
      transform-origin: left;
      margin-top: 2px;
    }

    nav a:hover::after {
      transform: scaleX(1);
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--color-text-header);
    }

    .auth-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.9rem;
      margin-left: 1rem;
    }

    button {
      background: var(--color-accent);
      color: var(--color-text-bright);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: var(--font-weight-bold);
      cursor: pointer;
      transition: background 0.2s ease;
    }

    button:hover {
      background: #a6541f;
    }

    

    .toggle-dark {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      user-select: none;
    }

    .toggle-switch {
      position: relative;
      width: 44px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      border-radius: 34px;
      transition: 0.3s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .toggle-switch input:checked + .slider {
      background-color: var(--color-accent);
    }

    .toggle-switch input:checked + .slider:before {
      transform: translateX(20px);
    }

    .slider:before {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
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
      detail: { enabled: target.checked },
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

            <label class="toggle-dark">
              Dark
              <div class="toggle-switch">
                <input type="checkbox" @change=${this.toggleDarkMode} />
                <span class="slider"></span>
              </div>
            </label>
          </div>
        </div>
      </header>
    `;
  }
}
