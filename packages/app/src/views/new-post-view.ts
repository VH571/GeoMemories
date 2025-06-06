import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Post, Location } from "server/models";

@customElement("new-post-view")
export class NewPostViewElement extends LitElement {
  @property() userId = "";

  @state()
  formData: Partial<Post> = {
    content: "",
    caption: "",
    locationId: "",
    picture: "",
  };

  @state()
  locations: Location[] = [];

  @state()
  showLocationForm = false;

  @state()
  newLocation: Partial<Location> = {
    name: "",
    coordinates: { lat: 0, lng: 0 },
    description: "",
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }

    form {
      display: grid;
      gap: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
    }

    .preview {
      max-width: 200px;
      margin-top: 1rem;
    }

    .add-location {
      margin-top: 0.5rem;
      cursor: pointer;
      color: blue;
      text-decoration: underline;
    }

    .location-form {
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 5px;
    }
  `;

  get token() {
    return localStorage.getItem("authToken");
  }

  connectedCallback() {
    super.connectedCallback();
    this.userId = localStorage.getItem("authUser") || "";

    this.loadLocations();
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
        console.log("Locations loaded successfully");
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
      <h2>Create a New Post</h2>
      ${!this.token ? html`<p>Please log in to create a post.</p>` : ""}
      <form @submit=${this.handleSubmit}>
        <label>
          Title:
          <input name="caption" type="text" @input=${this.handleChange} />
        </label>
        <label>
          Message:
          <textarea name="content" @input=${this.handleChange}></textarea>
        </label>
        <label>
          Location:
          <select name="locationId" @change=${this.handleChange}>
            <option value="">-- Select a Location --</option>
            ${this.locations.map(
              (loc) => html`<option value=${loc._id}>${loc.name}</option>`
            )}
          </select>
          <span class="add-location" @click=${this.toggleLocationForm}>
            + Add New Location
          </span>
        </label>
        <label>
          Attachment:
          <input type="file" accept="image/*" @change=${this.handleFile} />
          ${this.formData.picture
            ? html`<img
                class="preview"
                src="${this.formData.picture}"
                alt="Preview"
              />`
            : null}
        </label>

        ${this.showLocationForm
          ? html`
              <div class="location-form">
                <label>
                  Name:
                  <input
                    name="name"
                    type="text"
                    .value=${this.newLocation.name || ""}
                    @input=${this.updateNewLocation}
                  />
                </label>
                <label>
                  Latitude:
                  <input
                    name="lat"
                    type="number"
                    step="any"
                    .value=${this.newLocation.coordinates?.lat ?? ""}
                    @input=${this.updateNewLocation}
                  />
                </label>
                <label>
                  Longitude:
                  <input
                    name="lng"
                    type="number"
                    step="any"
                    .value=${this.newLocation.coordinates?.lng ?? ""}
                    @input=${this.updateNewLocation}
                  />
                </label>
                <label>
                  Description:
                  <input
                    name="description"
                    type="text"
                    .value=${this.newLocation.description || ""}
                    @input=${this.updateNewLocation}
                  />
                </label>
                <button type="button" @click=${this.createLocation}>
                  Create Location
                </button>
              </div>
            `
          : null}

        <button type="submit" ?disabled=${!this.token}>Submit</button>
      </form>
    `;
  }

  toggleLocationForm() {
    this.showLocationForm = !this.showLocationForm;
  }

  updateNewLocation(e: Event) {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

    if (name === "lat" || name === "lng") {
      const num = parseFloat(value);
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
        console.log("Location created successfully");
      } else {
        const errorText = await res.text();
        console.error("Failed to create location:", errorText);
        alert("Failed to create location");
      }
    } catch (error) {
      console.error("Error creating location:", error);
      alert("Error creating location");
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
        console.log("✅ Post submitted:", saved);

        this.formData = {
          content: "",
          caption: "",
          locationId: "",
          picture: "",
        };

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
