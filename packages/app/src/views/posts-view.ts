import { css } from "@calpoly/mustang";
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Post, Location } from "server/models";
import type { Auth } from "@calpoly/mustang";
import { Observer } from "@calpoly/mustang";
import "../components/feed-posts ";
@customElement("posts-view")
export class PostsViewElement extends LitElement {
  private _authObserver = new Observer<Auth.Model>(this, "geomem:auth");
  @state() posts: Post[] = [];
  @state() locations: Location[] = [];
  @state() token = "";
  @state() userId = "";

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
    }
    .container-post {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .header {
      margin: 0;
    }
    .login-message {
      text-align: center;
      color: var(--color-text);
      font-size: 16px;
      padding: 2rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth) => {
      if (auth.user?.authenticated) {
        this.token = auth.token ?? "";
        this.userId = auth.user.username ?? "";
        this.loadPosts();
        this.loadLocations();
      } else {
        this.token = "";
        this.userId = "";
      }
    });
  }

  async loadPosts() {
    try {
      const res = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (res.ok) {
        this.posts = await res.json();
      }
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  }

  async loadLocations() {
    try {
      const res = await fetch("/api/locations", {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      if (res.ok) {
        this.locations = await res.json();
      }
    } catch (err) {
      console.error("Error loading locations:", err);
    }
  }

  render() {
    return html`
      ${!this.token
        ? html`<div class="login-message">Please log in to see posts.</div>`
        : html`<div class="container-post">
            <h2 class="header">All Posts</h2>
            <feed-posts
              .posts=${this.posts}
              .locations=${this.locations}
            ></feed-posts>
          </div>`}
    `;
  }
}
