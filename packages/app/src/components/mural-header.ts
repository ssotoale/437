import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import reset from "../styles/reset.css.ts";

export class MuralHeaderElement extends HTMLElement {
  viewModel = createViewModel({
    authenticated: false,
    username: ""
  }).with(fromAuth(this), "authenticated", "username");

  view = html`
    <header>
      <h1>
        <svg class="icon"><use href="/icons/murals.svg#icon-painting" /></svg>
        Boyle Heights Murals
      </h1>
      <nav
        class=${($: any) =>
          $.authenticated ? "logged-in" : "logged-out"}>
        <p>Hello, ${($: any) => $.username || "visitor"}</p>
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
    :host { display: block; }
    header {
      background: var(--color-background-header);
      color: var(--color-text-inverted);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--size-spacing-small) var(--size-spacing-medium);
      font-family: var(--font-display);
    }
    h1 {
      color: var(--color-text-inverted);
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    svg.icon {
      height: 1.6em;
      width: 1.6em;
      vertical-align: middle;
      fill: currentColor;
    }
    nav {
      display: flex;
      align-items: center;
      gap: var(--size-spacing-medium);
    }
    nav p { font-size: 0.875rem; }
    menu {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li { display: none; }
    .logged-in .when-signed-in,
    .logged-out .when-signed-out {
      display: block;
    }
    a {
      color: var(--color-text-inverted);
      font-family: var(--font-display);
      font-size: 0.875rem;
    }
    button {
      background: var(--color-text-inverted);
      color: var(--color-background-header);
      border: none;
      padding: 0.35rem 0.85rem;
      border-radius: 4px;
      cursor: pointer;
      font-family: var(--font-display);
      font-size: 0.875rem;
      font-weight: bold;
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
