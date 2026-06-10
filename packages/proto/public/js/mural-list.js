import { html, shadow } from "@unbndl/html";

function renderMural(mural) {
  const { name, href } = mural;

  return html`
    <li><a href=${href}>${name}</a></li>
  `;
}

export class MuralListElement extends HTMLElement {
  constructor() {
    super();
    shadow(this);
    // no template
  }

  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue).then((data) => {
        const view = MuralListElement.render(data);
        shadow(this).replace(view);
      });
    }
  }

  static render(data) {
    const murals = data || [];
    return html`
      <ul class="murals">
        ${murals.map(renderMural)}
      </ul>
    `;
  }

  hydrate(src) {
    return fetch(src)
      .then((response) => {
        if (response.status !== 200)
          throw `HTTP Status ${response.status}`;
        else return response.json();
      })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
      });
  }
}