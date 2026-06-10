import { css, html, shadow } from "@unbndl/html";
import { createViewModel, fromInputs } from "@unbndl/view";
import reset from "../styles/reset.css.ts";

export class LoginFormElement extends HTMLElement {
  viewModel = createViewModel({
    username: "",
    password: ""
  }).with(fromInputs(this) as any, "username", "password");

  view = html`<form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`;

  constructor() {
    super();
    shadow(this)
      .styles(reset.styles, LoginFormElement.styles)
      .replace(this.viewModel.render(this.view as any))
      .listen({ submit: (ev: Event) =>
        this.submitLogin(ev, this.getAttribute("api") || "#") });
  }

  submitLogin(event: Event, endpoint: string) {
    event.preventDefault();
    const data = this.viewModel.toObject();
    const method = "POST";
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify(data);
    fetch(endpoint, { method, headers, body })
      .then((res) => {
        if (!res.ok)
          throw `Form submission failed: Status ${res.status}`;
        return res.json();
      })
      .then((json) => {
        const { token } = json;
        const customEvent = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token, redirect: "/app" }]
        });
        this.dispatchEvent(customEvent);
      });
  }

  static styles = css``;
}
