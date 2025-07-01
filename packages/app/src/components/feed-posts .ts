import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { Post, Location } from "server/models";
import "./post-filter.ts";

import {
  locationIcon,
  menuIcon,
  heartIcon,
  commentIcon,
  shareIcon,
} from "./icons.ts";

@customElement("feed-posts")
export class FeedPosts extends LitElement {
  @property({ type: Array }) posts: Post[] = [];
  @property({ type: Array }) locations: Location[] = [];
  @state() filterField: string = "all";
  @state() filterQuery: string = "";

  static styles = css`
  :host {
    display: block;
    width: 100%;
    font-family: var(--font-family-base);
    min-height: 100vh;
    color: var(--color-text);
    background-color: var(--color-background-page);
  }

  .post {
    border-radius: 12px;
    overflow: hidden;
    max-width: 400px;
    margin: 0 auto 0;
    background-color: var(--color-background-page);
  }

  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
  }

  .user-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .username {
    color: var(--color-text);
    font-size: 14px;
    font-weight: var(--font-weight-bold);
    margin: 0;
  }

  .location-info {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .location-icon {
    width: 12px;
    height: 12px;
    fill: var(--color-text);
  }

  .location-text {
    color: var(--color-text);
    font-size: 12px;
    font-weight: var(--font-weight-normal);
  }

  .menu-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
    fill: var(--color-text);
  }

  .post-body {
    padding: 0 16px 16px;
  }

  .caption {
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 12px;
    color: var(--color-text);
  }

  .caption .text {
    color: var(--color-text);
  }

  .caption .hashtag {
    color: var(--color-accent);
    font-weight: var(--font-weight-bold);
  }

  .post-image {
    width: 100%;
    height: 250px;
    border-radius: 0 0 12px 12px;
    object-fit: cover;
  }

  .post-footer {
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: right;
    border-top: 1px solid rgba(40, 54, 24, 0.3);
  }

  .interaction {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 20px;
    transition: background-color 0.2s ease;
  }

  .interaction:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  .interaction-icon {
    width: 18px;
    height: 18px;
    fill: var(--color-text);
  }

  .interaction-count {
    color: var(--color-text);
    font-size: 13px;
    font-weight: 500;
    font-family: system-ui, sans-serif;
  }

  .no-results {
    text-align: center;
    padding: 40px 20px;
    color: var(--color-text);
    font-size: 16px;
  }
`;


  private parseCaption(caption: string) {
    const parts = caption.split(/(#\w+)/g);
    return parts.map((part) =>
      part.startsWith("#")
        ? html`<span class="hashtag">${part}</span>`
        : html`<span class="text">${part}</span>`
    );
  }

  private handleFilterChange(e: CustomEvent) {
    const { field, query } = e.detail;
    this.filterField = field;
    this.filterQuery = query;
  }

  private getFilteredPosts() {
    if (!this.filterQuery) {
      return this.posts;
    }

    const search = this.filterQuery.toLowerCase();

    return this.posts.filter((post) => {
      const location = this.locations.find(
        (loc) => loc._id === post.locationId
      );
      const locationName = location?.name?.toLowerCase() || "";

      switch (this.filterField) {
        case "all":
          return (
            post.caption?.toLowerCase().includes(search) ||
            post.userId?.toLowerCase().includes(search) ||
            locationName.includes(search)
          );
        case "caption":
          return post.caption?.toLowerCase().includes(search);
        case "userId":
          return post.userId?.toLowerCase().includes(search);
        case "location":
          return locationName.includes(search);
        default:
          return false;
      }
    });
  }

  render() {
    const filteredPosts = this.getFilteredPosts();

    return html`
      <post-filter @filter-change=${this.handleFilterChange}></post-filter>
      <div>
        ${filteredPosts.length === 0 && this.filterQuery
          ? html`<div class="no-results">
              No posts found matching "${this.filterQuery}"
              ${this.filterField !== "all" ? ` in ${this.filterField}` : ""}.
            </div>`
          : filteredPosts.length === 0
          ? html`<div class="no-results">No posts available.</div>`
          : filteredPosts.map((post) => {
              const location = this.locations.find(
                (loc) => loc._id === post.locationId
              );
              return html`
                <div class="post">
                  <div class="post-header">
                    <div class="user-section">
                      <img
                        class="avatar"
                        src=${post.profilePicture ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${post.userId}`}
                        alt="User avatar"
                      />

                      <div class="user-info">
                        <div class="username">${post.userId}</div>
                        ${location
                          ? html`
                              <div class="location-info">
                                ${locationIcon}
                                <div class="location-text">
                                  ${location.name}
                                </div>
                              </div>
                            `
                          : ""}
                      </div>
                    </div>
                    ${menuIcon}
                  </div>

                  <div class="post-body">
                    <div class="caption">
                      ${this.parseCaption(post.caption)}
                    </div>
                    ${post.picture
                      ? html`<img
                          class="post-image"
                          src=${post.picture}
                          alt="Post image"
                        />`
                      : ""}
                  </div>

                  <div class="post-footer">
                    <div class="interaction">
                      ${commentIcon}
                      <div class="interaction-count">12</div>
                    </div>
                    <div class="interaction">
                      ${heartIcon}
                      <div class="interaction-count">25</div>
                    </div>
                  </div>
                </div>
              `;
            })}
      </div>
    `;
  }
}