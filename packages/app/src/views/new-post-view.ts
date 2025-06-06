import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("new-post-view")
export class NewPostViewElement extends LitElement {
  render() {
    return html`<h2>Create a New Post</h2>`;
  }
}
