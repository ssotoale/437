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
    :host { display: block; padding: var(--size-spacing-medium); }
    .murals {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      list-style: none;
      padding: 0;
      gap: var(--size-spacing-medium);
    }
    @media (max-width: 48rem) {
      .murals { grid-template-columns: 1fr; }
    }
    .mural-card {
      background: var(--color-card-bg);
      border: 1px solid var(--color-accent);
      border-radius: var(--radius-card);
      overflow: hidden;
    }
    .mural-card a { text-decoration: none; color: inherit; }
    .mural-card img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      display: block;
    }
    .card-body { padding: var(--size-spacing-small); }
    .card-body h2 {
      font-family: var(--font-display);
      color: var(--color-accent);
      font-size: 1rem;
      margin-bottom: 0.2rem;
    }
    .card-body .artist { font-size: 0.8rem; margin-bottom: 0.4rem; }
    .badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.7rem;
      font-weight: bold;
      color: #fff;
    }
    .badge.pristine  { background: var(--color-badge-pristine); }
    .badge.good      { background: var(--color-badge-good); }
    .badge.faded     { background: var(--color-badge-faded); }
    .badge.damaged   { background: var(--color-badge-damaged); }
    .badge.restored  { background: var(--color-badge-restored); }
    .card-meta { font-size: 0.75rem; margin-top: 0.25rem; }
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
      <li class="mural-card">
        <a href="/app/mural/${m._id}">
          <img src="/${m.name}.jpeg"
               onerror="if(this.src.endsWith('.jpeg')){this.src=this.src.replace('.jpeg','.jpg')}else{this.style.display='none'}"
               alt="${m.name}">
          <div class="card-body">
            <h2>${m.name}</h2>
            <p class="artist">${m.artist}</p>
            <p class="card-meta">
              <span class="badge ${m.condition}">${m.condition}</span>
              &nbsp;${m.yearMade}
            </p>
          </div>
        </a>
      </li>
    `).join("");
  }
}
