import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer } from "@calpoly/mustang";
import type { Auth } from "@calpoly/mustang";
import { Post, Location } from "server/models";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("new-post-view")
export class NewPostViewElement extends LitElement {
  private _authObserver = new Observer<Auth.Model>(this, "geomem:auth");
  @state() locations: Location[] = [];
  @state() showLocationForm = false;
  @state() token = "";
  @state() userId = "";
  @state()
  formData: Partial<Post> = {
    content: "",
    caption: "",
    locationId: "",
    picture: "",
  };
  @state()
  newLocation: Partial<Location> = {
    name: "",
    coordinates: { lat: 0, lng: 0 },
    description: "",
  };

  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      max-width: 400px;
      margin: 0 auto;
      color: var(--color-text-default);
      background-color: var(--color-background-page);
      font-family: var(--font-family-base);
    }

    .post-card {
      border-radius: 12px;
      padding: 1.5rem;
      background-color: var(--color-background-page);
    }

    .location-section {
      margin-bottom: 1.5rem;
    }

    .location-map {
      width: 100%;
      height: 150px;
      background: linear-gradient(
        135deg,
        #a8e6a3 0%,
        #88c999 50%,
        var(--color-background-page) 100%
      );
      border-radius: 8px;
      position: relative;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-default);
      font-size: 14px;
    }

    .location-indicator {
      position: absolute;
      bottom: 20px;
      left: 20px;
      width: 12px;
      height: 12px;
      background: #e74c3c;
      border-radius: 50%;
      border: 2px solid white;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-header);
      margin-bottom: 0.5rem;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--color-accent);
      border-radius: 8px;
      font-size: 14px;
      background: var(--color-background-input, white);
      color: var(--color-text-default);
      box-sizing: border-box;
      transition: border-color 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 2px rgba(188, 108, 37, 0.2);
    }

    .form-textarea {
      min-height: 80px;
      resize: vertical;
      font-family: inherit;
    }

    .form-select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
    }

    .add-location-btn {
      color: var(--color-accent);
      font-size: 13px;
      cursor: pointer;
      margin-top: 0.25rem;
      display: inline-block;
      text-decoration: none;
      font-weight: var(--font-weight-bold);
    }

    .add-location-btn:hover {
      text-decoration: underline;
    }

    .attachment-section {
      border: 2px dashed var(--color-accent);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .attachment-section:hover {
      border-color: var(--color-text-default);
    }

    .attachment-icon {
      font-size: 24px;
      margin-bottom: 0.5rem;
      color: var(--color-text-default);
    }

    .attachment-text {
      font-size: 14px;
      color: var(--color-text-default);
      font-weight: var(--font-weight-bold);
    }

    .file-input {
      display: none;
    }

    .preview-image {
      max-width: 100%;
      max-height: 150px;
      border-radius: 8px;
      margin-top: 0.5rem;
    }

    .button-group {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn {
      flex: 1;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--color-accent);
      color: var(--color-background-page);
    }

    .btn-primary:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: var(--color-accent);
      color: var(--color-background-page);
      border: 1px solid var(--color-accent);
    }

    .btn-secondary:hover {
      filter: brightness(1.1);
    }

    .location-form {
      background: var(--color-background-page);
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      border: 1px solid var(--color-accent);
    }

    .location-form-title {
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      margin-bottom: 1rem;
      color: var(--color-text-header);
    }

    .login-message {
      text-align: center;
      color: var(--color-text-default);
      font-size: 16px;
      padding: 2rem;
    }

    .coordinate-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth) => {
      if (auth.user?.authenticated) {
        this.token = auth.token ?? "";
        this.userId = auth.user.username ?? "";
        this.loadLocations();
      } else {
        this.token = "";
        this.userId = "";
      }
    });
  }

  async loadLocations() {
    try {
      const res = await fetch("http://localhost:3010/api/locations", {
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

  render() {
    return html`
      ${!this.token
        ? html`<div class="login-message">Please log in to create a post.</div>`
        : html`
            <div class="post-card">
              <form @submit=${this.handleSubmit} id="post-form">
                <div class="location-section">
                  <div class="location-map">
                    Current Location Map Not Available
                    <div class="location-indicator"></div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Subject</label>
                  <input
                    name="caption"
                    type="text"
                    class="form-input"
                    placeholder="Subject line here"
                    @input=${this.handleChange}
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Message</label>
                  <textarea
                    name="content"
                    class="form-input form-textarea"
                    placeholder="Type your message here..."
                    @input=${this.handleChange}
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">Location</label>
                  <select
                    name="locationId"
                    class="form-input form-select"
                    @change=${this.handleChange}
                  >
                    <option value="">-- Select a Location --</option>
                    ${this.locations.map(
                      (loc) =>
                        html`<option value=${ifDefined(loc._id)}>
                          ${loc.name}
                        </option>`
                    )}
                  </select>
                  <span
                    class="add-location-btn"
                    @click=${this.toggleLocationForm}
                  >
                    + Add New Location
                  </span>
                </div>

                ${this.showLocationForm
                  ? html`
                      <div class="location-form">
                        <div class="location-form-title">Add New Location</div>
                        <div class="form-group">
                          <label class="form-label">Name</label>
                          <input
                            name="name"
                            type="text"
                            class="form-input"
                            .value=${this.newLocation.name || ""}
                            @input=${this.updateNewLocation}
                          />
                        </div>
                        <div class="coordinate-group">
                          <div class="form-group">
                            <label class="form-label">Latitude</label>
                            <input
                              name="lat"
                              type="number"
                              step="1"
                              class="form-input"
                              .value=${String(
                                this.newLocation.coordinates?.lat ?? ""
                              )}
                              @input=${this.updateNewLocation}
                            />
                          </div>
                          <div class="form-group">
                            <label class="form-label">Longitude</label>
                            <input
                              name="lng"
                              type="number"
                              step="1"
                              class="form-input"
                              .value=${String(
                                this.newLocation.coordinates?.lng ?? ""
                              )}
                              @input=${this.updateNewLocation}
                            />
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="form-label">Description</label>
                          <input
                            name="description"
                            type="text"
                            class="form-input"
                            .value=${this.newLocation.description || ""}
                            @input=${this.updateNewLocation}
                          />
                        </div>
                        <button
                          type="button"
                          class="btn btn-primary"
                          @click=${this.createLocation}
                        >
                          Create Location
                        </button>
                      </div>
                    `
                  : null}

                <div class="form-group">
                  <div
                    class="attachment-section"
                    @click=${this.triggerFileInput}
                  >
                    <div class="attachment-icon"></div>
                    <div class="attachment-text">Add attachment</div>
                    <input
                      type="file"
                      accept="image/*"
                      class="file-input"
                      @change=${this.handleFile}
                    />
                    ${this.formData.picture
                      ? html`<img
                          class="preview-image"
                          src="${this.formData.picture}"
                          alt="Preview"
                        />`
                      : null}
                  </div>
                </div>

                <div class="button-group">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    ?disabled=${!this.token}
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click=${this.resetForm}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          `}
    `;
  }

  triggerFileInput() {
    const fileInput = this.shadowRoot?.querySelector(
      ".file-input"
    ) as HTMLInputElement;
    fileInput?.click();
  }

  resetForm() {
    this.formData = {
      content: "",
      caption: "",
      locationId: "",
      picture: "",
    };
    this.showLocationForm = false;
    this.newLocation = {
      name: "",
      coordinates: { lat: 0, lng: 0 },
      description: "",
    };

    const form = this.shadowRoot?.getElementById(
      "post-form"
    ) as HTMLFormElement;
    form?.reset();

    const fileInput = this.shadowRoot?.querySelector(
      ".file-input"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  toggleLocationForm() {
    this.showLocationForm = !this.showLocationForm;
  }

  updateNewLocation(e: Event) {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    if (name === "lat" || name === "lng") {
      const num = parseFloat(value) || 0;
      this.newLocation = {
        ...this.newLocation,
        coordinates: {
          lat: name === "lat" ? num : this.newLocation.coordinates?.lat ?? 0,
          lng: name === "lng" ? num : this.newLocation.coordinates?.lng ?? 0,
        },
      };
    } else {
      this.newLocation = {
        ...this.newLocation,
        [name]: value,
      };
    }
  }

  async createLocation() {
    const { coordinates } = this.newLocation;

    const lat = coordinates?.lat;
    const lng = coordinates?.lng;

    if (
      typeof lat !== "number" ||
      isNaN(lat) ||
      lat < -90 ||
      lat > 90 ||
      typeof lng !== "number" ||
      isNaN(lng) ||
      lng < -180 ||
      lng > 180
    ) {
      alert("Invalid latitude or longitude values.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3010/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(this.newLocation),
      });

      if (res.ok) {
        const created = await res.json();
        this.locations = [...this.locations, created];
        this.formData.locationId = created._id;
        this.showLocationForm = false;
        this.newLocation = {
          name: "",
          coordinates: { lat: 0, lng: 0 },
          description: "",
        };
        alert("Location created successfully.");
      } else {
        const errorJson = await res.json();
        console.error("Failed to create location:", errorJson);
        alert(errorJson.error || "Unknown error occurred");
      }
    } catch (error: any) {
      console.error("Error creating location:", error);
      alert(error.message || "Unexpected error");
    }
  }

  handleChange(e: Event) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    this.formData = {
      ...this.formData,
      [target.name]: target.value,
    };
  }

  handleFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.formData = {
        ...this.formData,
        picture: reader.result as string,
      };
    };
    reader.readAsDataURL(file);
  }

  async handleSubmit(e: Event) {
    e.preventDefault();

    if (!this.token) {
      alert("You must be logged in to create a post.");
      return;
    }

    const post: Post = {
      userId: this.userId,
      content: this.formData.content || "",
      caption: this.formData.caption || "",
      locationId: this.formData.locationId || "",
      picture: this.formData.picture,
      createdAt: new Date(),
    };

    try {
      const res = await fetch("http://localhost:3010/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(post),
      });

      if (res.ok) {
        const saved = await res.json();
        console.log("Post submitted:", saved);

        this.resetForm();
        alert("Post created!");
      } else {
        const errText = await res.text();
        console.error("Post failed:", errText);
        alert("Failed to submit post");
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      alert("Something went wrong");
    }
  }
}
