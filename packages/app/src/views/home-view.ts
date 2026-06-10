import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { Store, fromStore } from "@unbndl/store";
import { Model } from "../model.ts";
import { Mural } from "server/models";

export class HomeViewElement extends HTMLElement {
  viewModel = createViewModel<Model>({ murals: [] })
    .with(fromStore<Model>(this), "murals");

  static template = html`<template>
    <section class="mural-list">
      <h1>Boyle Heights Murals</h1>
      <ul class="murals">
      </ul>
    </section>
  </template>`;

  static styles = css`
    :host { display: block; padding: 1rem; }
    .murals { list-style: none; padding: 0; }
  `;

  constructor() {
    super();
    shadow(this)
      .template(HomeViewElement.template)
      .styles(HomeViewElement.styles);
    this.viewModel.createEffect(($) => {
      if ($.murals) this.render($.murals);
    });
  }

  connectedCallback() {
    Store.dispatch(this, ["murals/request", {}]);
  }

  render(murals: Mural[]) {
    const ul = this.shadowRoot?.querySelector(".murals");
    if (!ul) return;
    ul.innerHTML = murals.map((m) => `
      <li>
        <a href="/app/mural/${m._id}">${m.name}</a>
        <p>${m.artist}</p>
      </li>
    `).join("");
  }
}
