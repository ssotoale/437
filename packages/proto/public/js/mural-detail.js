import { html, css, shadow } from "@unbndl/html";
import reset from "./styles/reset.css.js";

export class MuralDetailElement extends HTMLElement {
  static template = html`
    <template>
      <p>Location: <slot name="location">Unknown</slot></p>
      <p>Status: <span id="status"></span></p>
      <p>History: <slot name="history">No history available.</slot></p>
    </template>
  `;

  constructor() {
    super();
    shadow(this)
      .template(MuralDetailElement.template)
      .styles(reset.styles, MuralDetailElement.styles);
  }

  static observedAttributes = ["status"];

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "status":
        const el = this.shadowRoot.querySelector("#status");
        if (el) el.textContent = newValue;
        break;
    }
  }

  static styles = css`
    p {
      margin-bottom: var(--size-spacing-medium);
    }
  `;
}