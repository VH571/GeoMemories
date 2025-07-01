import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { Events } from "@calpoly/mustang";
@customElement("home-view")
export class HomeViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      text-align: center;
      background-color: var(--color-background-page);
      color: var(--color-text);
      font-family: var(--font-family-base);
    }

    h1 {
      font-size: 2.2rem;
      margin-bottom: 1rem;
      color: var(--color-accent);
      font-family: var(--font-family-display);
    }

    p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .button-row {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }

    a.button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      background-color: var(--color-accent);
      color: var(--color-text);
      font-weight: var(--font-weight-bold);
      text-decoration: none;
      transition: background 0.2s ease;
    }

    a.button:hover {
      background-color: #a6541f;
    }
  `;

  render() {
    return html`
      <h1>Welcome to GeoMemories 🌍</h1>
      <p>
        Capture, share, and relive your adventures. Post memories, attach
        locations, and explore your map of experiences.
      </p>
      <div class="button-row">
        <a href="/app/posts" class="button">View Posts</a>
        <a href="/app/new" class="button">Create a Memory</a>
        <a href="/app/map" class="button">Explore Map</a>
      </div>
    `;
  }
}
