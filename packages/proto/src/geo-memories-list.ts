import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

interface Memory {
  title: string;
  href: string;
}

export class GeoMemoriesList extends LitElement {
  @property()
  src?: string;

  @state()
  memories: Memory[] = [];

  static styles = css``;

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  async hydrate(src: string) {
    const res = await fetch(src);
    if (!res.ok) return;
    const json = await res.json();
    this.memories = json as Memory[];
  }

  renderMemory(memory: Memory) {
    return html`
      <geo-memory href=${memory.href}>
        <span slot="title">${memory.title}</span>
      </geo-memory>
    `;
  }

  render() {
    return html` ${this.memories.map((m) => html`${this.renderMemory(m)}`)} `;
  }
}
