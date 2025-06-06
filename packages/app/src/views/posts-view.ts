import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("posts-view")
export class PostsViewElement extends LitElement {
  render() {
    return html`<h2>All Posts</h2>`;
  }
}
