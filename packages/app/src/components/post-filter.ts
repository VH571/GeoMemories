import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("post-filter")
export class PostFilter extends LitElement {
  @state() inputValue: string = "";
  @state() appliedFilter: string = "";
  @state() activeButton: string = "";
  @state() selectedField: string = "all";

  static styles = css`
  :host {
    display: block;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    color: var(--color-text);
    background-color: var(--color-background-page);
    font-family: var(--font-family-base);
  }

  .filter-wrapper {
    max-width: 400px;
    margin: 0 auto 12px;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 50px;
    background: var(--color-background-page);
    border: 1px solid var(--color-accent);
    gap: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  input[type="text"] {
    flex: 1;
    border: none;
    font-size: 16px;
    font-weight: var(--font-weight-bold);
    background: transparent;
    color: var(--color-text);
    outline: none;
    font-family: var(--font-family-base);
  }

  input[type="text"]::placeholder {
    color: var(--color-text);
    opacity: 0.5;
  }

  select {
    border: none;
    font-size: 14px;
    background: var(--color-background-page);
    padding: 6px 10px;
    border-radius: 20px;
    font-weight: var(--font-weight-bold);
    color: var(--color-text);
    outline: none;
    cursor: pointer;
  }

  select:hover {
    filter: brightness(1.05);
  }

  .search-icon,
  .filter-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    stroke: var(--color-text);
  }

  .applied-filter {
    max-width: 400px;
    margin: 0 auto 16px;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--color-text);
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: 14px;
    font-weight: var(--font-weight-bold);
    padding: 6px 12px;
    border-radius: 12px;
  }

  .clear-btn {
    cursor: pointer;
    font-size: 12px;
    background: var(--color-background-page);
    color: var(--color-text);
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: background-color 0.2s ease;
  }

  .clear-btn:hover {
    background-color: rgba(188, 108, 37, 0.15);
  }
`;


  render() {
    return html`
      <div class="filter-wrapper">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke="currentColor"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor"/>
        </svg>
        <input
          type="text"
          placeholder="Search..."
          .value=${this.inputValue}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
        />
        <select @change=${this.handleFieldChange} .value=${this.selectedField}>
          <option value="all">All</option>
          <option value="caption">Content</option>
          <option value="userId">User</option>
          <option value="location">Location</option>
        </select>
      </div>

      ${this.appliedFilter
        ? html`<div class="applied-filter">
            <div class="tag">
              Filter: ${this.getFilterDisplayText()} contains "${this.appliedFilter}"
              <button class="clear-btn" @click=${this.clearFilter}>✕</button>
            </div>
          </div>`
        : null}
    `;
  }

  private handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    this.inputValue = target.value;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && this.inputValue.trim()) {
      this.appliedFilter = this.inputValue.trim();
      this.dispatchEvent(
        new CustomEvent("filter-change", {
          detail: {
            field: this.selectedField,
            query: this.appliedFilter,
          },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleFieldChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.selectedField = target.value;
  }

  private clearFilter() {
    this.inputValue = "";
    this.appliedFilter = "";
    this.dispatchEvent(
      new CustomEvent("filter-change", {
        detail: { field: this.selectedField, query: "" },
        bubbles: true,
        composed: true,
      })
    );
  }

  private getFilterDisplayText(): string {
    switch (this.selectedField) {
      case "all":
        return "all fields";
      case "caption":
        return "content";
      case "userId":
        return "user";
      case "location":
        return "location";
      default:
        return this.selectedField;
    }
  }
}