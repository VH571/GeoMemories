import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { customElement } from "lit/decorators.js";
import { Auth, Events, Observer } from "@calpoly/mustang";
import { homeIcon, feedIcon, postIcon, mapIcon, darkIcon } from "./icons.ts";

@customElement("geomem-header")
export class GeomemHeader extends LitElement {
  @state() loggedIn = false;
  @state() userid?: string;
  @state() showDropdown = false;
  @state() darkmode = false;
  private _authObserver = new Observer<Auth.Model>(this, "geomem:auth");

  static styles = css`
    /* ====== Layout Containers ====== */
    header {
      background: var(--color-background-page);
      color: var(--color-text);
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
      gap: 1rem;
    }

    /* ====== Navigation ====== */
    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      text-decoration: none;
      color: var(--color-text);
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

    .interaction {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 20px;
      transition: background-color 0.2s ease;
    }

    .interaction h2 {
      margin: 0px;
    }

    /* ====== Auth Section ====== */
    .auth-section {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 1rem;
      margin-left: 1rem;
    }

    .auth-button {
      display: inline-block;
      padding: 10px 5px 10px 5px;
      border-radius: 8px;
      background-color: var(--color-secondary);
      color: var(--color-text);
      border: none;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-button:hover {
      filter: opacity(0.9);
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--color-text);
    }

    /* ====== Toggle Switch ====== */
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
      background-color: var(--color-secondary);
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
      background-color: var(--color-text);
      transition: 0.3s;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .toggle-switch input:checked + .slider {
      background-color: var(--color-secondary);
    }

    .toggle-switch input:checked + .slider:before {
      transform: translateX(20px);
    }

    /* ====== Profile Menu ====== */
    .profile-menu {
      position: relative;
    }

    .avatar {
      font-size: 1.6rem;
      border-radius: 20px;
      background-color: var(--color-secondary);
      width: 42px;
      height: 42px;
      border: none;
      cursor: pointer;
    }

    .dropdown {
      position: absolute;
      right: 0;
      top: 2.5rem;
      background: var(--color-background-page);
      border: 1px solid var(--color-accent);
      border-radius: 8px;
      padding: 0.75rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 100;
    }

    /* ====== Miscellaneous ====== */
    .navbar-icon {
      fill: var(--color-secondary);
    }
  `;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
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

    document.addEventListener("click", (e) => {
      const path = e.composedPath();
      if (
        this.showDropdown &&
        !path.some(
          (el) =>
            el instanceof HTMLElement && el.classList?.contains("profile-menu")
        )
      ) {
        this.showDropdown = false;
      }
    });
    const saved = localStorage.getItem("darkmode");
    if (saved === "true") {
      this.darkmode = true;
      document.body.classList.add("dark-mode");
    }

    document.body.addEventListener("darkmode:toggle", (event: any) => {
      const enabled = event.detail.enabled;
      document.body.classList.toggle("dark-mode", enabled);
    });
  }

  toggleDarkMode(e: Event) {
    const target = e.target as HTMLInputElement;
    this.darkmode = target.checked;

    localStorage.setItem("darkmode", String(this.darkmode));

    const customEvent = new CustomEvent("darkmode:toggle", {
      bubbles: true,
      detail: { enabled: this.darkmode },
    });
    this.dispatchEvent(customEvent);
  }

  render() {
    return html`
      <header>
        <div class="site-title">
          <h1>GeoMemories</h1>
        </div>
        <div class="nav-container">
          <nav>
            <a href="/app">
              <div class="interaction">
                ${homeIcon}
                <h2>Home</h2>
              </div>
            </a>
            <a href="/app/posts">
              <div class="interaction">
                ${feedIcon}
                <h2>Posts</h2>
              </div>
            </a>
            <a href="/app/new">
              <div class="interaction">
                ${postIcon}
                <h2>New</h2>
              </div>
            </a>
            <a href="/app/map">
              <div class="interaction">
                ${mapIcon}
                <h2>Map</h2>
              </div>
            </a>
          </nav>
          <div class="auth-section">
            ${this.loggedIn
              ? html`
                  <div class="profile-menu">
                    <button
                      class="avatar"
                      @click=${this.toggleDropdown}
                    ></button>
                    ${this.showDropdown
                      ? html`
                          <div class="dropdown">
                            <span>Hello, ${this.userid}</span>
                            <label class="toggle-dark">
                              ${darkIcon}
                              <div class="toggle-switch">
                                <input
                                  type="checkbox"
                                  .checked=${this.darkmode}
                                  @change=${this.toggleDarkMode}
                                />

                                <span class="slider"></span>
                              </div>
                            </label>
                            <button
                              class="auth-button"
                              @click=${(e: Event) =>
                                Events.relay(e, "auth:message", [
                                  "auth/signout",
                                ])}
                            >
                              Sign Out
                            </button>
                          </div>
                        `
                      : null}
                  </div>
                `
              : html`<a href="/login" class="auth-button">Sign In</a>`}
          </div>
        </div>
      </header>
    `;
  }
}
