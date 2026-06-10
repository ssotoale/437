// proto/public/js/header.js
import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import reset from "./styles/reset.css.js";

export class MuralHeaderElement extends HTMLElement {
  viewModel = createViewModel({
    authenticated: false
  }).with(fromAuth(this), "authenticated", "username");

  view = html`
    <header>
      <h1>
        <svg class="icon"><use href="/icons/murals.svg#icon-painting" /></svg>
        Boyle Heights Murals
      </h1>
      <nav
        class=${($) =>
          $.authenticated ? "logged-in" : "logged-out"}>
        <p>Hello, ${($) => $.username || "visitor"}</p>
        <menu>
          <li class="when-signed-in">
            <button>Sign Out</button>
          </li>
          <li class="when-signed-out">
            <a href="/login.html">Sign In</a>
          </li>
        </menu>
      </nav>
    </header>
  `;

  static styles = css`
    li {
      display: none;
    }
    .logged-in .when-signed-in,
    .logged-out .when-signed-out {
      display: block;
    }
  `;

  constructor() {
    super();
    shadow(this)
      .styles(reset.styles, MuralHeaderElement.styles)
      .replace(this.viewModel.render(this.view))
      .delegate(".when-signed-in button", {
        click: () => this.signout()
      });
  }

  signout() {
    const customEvent = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"]
    });
    this.dispatchEvent(customEvent);
  }
}
