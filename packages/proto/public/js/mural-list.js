import { html, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

function renderMural(mural) {
  const { name, _id } = mural;
  return html`
    <li><a href=/mural.html?id=${_id}>${name}</a></li>
  `;
}

export class MuralListElement extends HTMLElement {
  viewModel = createViewModel({
    token: undefined,
    authenticated: false,
    murals: []
  }).with(fromAttributes(this), "src")
    .with(fromAuth(this), "authenticated", "token");

  view = html`
    <ul class="murals">
      ${($) => $.murals.map(renderMural)}
    </ul>
  `;

  get authorization() {
    const $ = this.viewModel.toObject();
    if ($.authenticated)
      return { Authorization: `Bearer ${$.token}` };
    else return {};
  }

  constructor() {
    super();
    shadow(this).replace(this.viewModel.render(this.view));

    this.viewModel.createEffect(($) => {
      if ($.authenticated && $.src) {
        this.hydrate($.src).then((data) => {
          this.viewModel.set("murals", data);
        });
      }
    });
  }

  hydrate(src) {
    return fetch(src, { headers: this.authorization })
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
