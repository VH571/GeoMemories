import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Post, Location } from "server/models";
import { Observer } from "@calpoly/mustang";
import type { Auth } from "@calpoly/mustang";
import "../components/mapbox-map";
@customElement("map-view")
export class MapViewElement extends LitElement {
  private _authObserver = new Observer<Auth.Model>(this, "geomem:auth");

  @state() posts: Post[] = [];
  @state() locations: Location[] = [];
  @state() token = "";
  @state() userId = "";
  async loadPosts() {
    try {
      const res = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (res.ok) {
        this.posts = await res.json();
      } else {
        const msg = await res.json();
        console.error("Failed to load post:", msg);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }
  async loadLocations() {
    try {
      const res = await fetch("/api/locations", {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (res.ok) {
        this.locations = await res.json();
      } else {
        const msg = await res.text();
        console.error("Failed to load locations:", msg);
      }
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth) => {
      if (auth.user?.authenticated) {
        this.token = auth.token ?? "";
        this.userId = auth.user.username ?? "";
        this.loadLocations();
        this.loadPosts();
      } else {
        this.token = "";
        this.userId = "";
      }
    });
  }
  render() {
    console.log("Rendering map with posts:", this.posts);
console.log("Rendering map with locations:", this.locations);

    return html`
      <mapbox-map
        style="height: 500px;"
        .posts=${this.posts}
        .locations=${this.locations}
      >
      </mapbox-map>
    `;
  }
}
