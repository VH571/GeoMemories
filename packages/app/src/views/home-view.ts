import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("home-view")
export class HomeViewElement extends LitElement {
  render() {
    return html`<p>Welcome to the GeoMemories Home Page!</p>`;
  }
}
