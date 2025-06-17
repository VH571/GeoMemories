import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import type { Post, Location } from "server/models";

mapboxgl.accessToken =
  "pk.eyJ1IjoidmhlcnJlMTMiLCJhIjoiY21icGtqNW9pMDVkdjJxcHR4bXZpY3A5NyJ9.TMlMGy2Hex_9-l-LMdI6YQ";
@customElement("mapbox-map")
export class MapboxMap extends LitElement {
  @property({ type: Array }) posts: Post[] = [];
  @property({ type: Array }) locations: Location[] = [];

  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }

    #map {
      
    }
  `;

  map?: mapboxgl.Map;

  firstUpdated() {
    const mapDiv = this.renderRoot.querySelector("#map") as HTMLElement;

    this.map = new mapboxgl.Map({
      container: mapDiv,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-122.3, 37.8],
      zoom: 8,
    });

    this.map.on("load", () => {
      this.map!.resize();
      this.addMarkers();

      const bounds = new mapboxgl.LngLatBounds();

      this.locations.forEach((loc) => {
        if (loc.coordinates) {
          const { lng, lat } = loc.coordinates;
          bounds.extend([lng, lat]);
        }
      });

      if (!bounds.isEmpty()) {
        this.map!.fitBounds(bounds, { padding: 50 });
      }
    });
  }
  willUpdate(changed: Map<string | number | symbol, unknown>) {
    if (changed.has("posts") || changed.has("locations")) {
      if (this.map && this.map.loaded()) {
        this.addMarkers();
      }
    }
  }

  private markers: mapboxgl.Marker[] = [];

  addMarkers() {
    if (!this.map) return;

    this.markers.forEach((m) => m.remove());
    this.markers = [];

    this.posts.forEach((post) => {
      const loc = this.locations.find((l) => l._id === post.locationId);
      if (!loc?.coordinates) return;

      const { lat, lng } = loc.coordinates;

      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setText(post.caption || "No caption"))
        .addTo(this.map!);

      this.markers.push(marker);
    });
  }

  render() {
    return html`<div id="map"> </div>`;
  }


}
