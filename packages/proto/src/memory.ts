import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

export class GeoMemoryElement extends LitElement {
  @property() href = "";

  static styles = [
    reset.styles,
    css`
      a {
        color: var(--color-accent);
        text-decoration: none;
      }
    `,
  ];

  override render() {
    try {
      return html`
        <li>
          <a href="${this.href}">
            <slot name="title">[missing title]</slot>
          </a>
        </li>
      `;
    } catch (e) {
      console.error("Render error:", e);
      return html`<li>Error rendering memory</li>`;
    }
  }
}
