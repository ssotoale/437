import { css, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { Store, fromStore } from "@unbndl/store";
import { BrowserHistory } from "@unbndl/switch";
import { Model } from "../model.ts";
import { Mural } from "server/models";

type MuralMode = "view" | "edit";
type MuralDetailAttributes = { "mural-id"?: string };

interface MuralDetailViewModel {
  mode: MuralMode;
  muralid?: string;
  mural?: Mural;
}

export class MuralDetailElement extends HTMLElement {
  static observedAttributes = ["mural-id"];

  viewModel = createViewModel<MuralDetailViewModel>({ mode: "view" })
    .withRenamed(fromAttributes<MuralDetailAttributes>(this), { muralid: "mural-id" })
    .with(fromStore<Model>(this), "mural");

  static styles = css`
    :host { display: block; padding: var(--size-spacing-medium); }

    /* view mode */
    .mural-detail img {
      width: 100%;
      max-height: 22rem;
      object-fit: cover;
      border-radius: var(--radius-card) var(--radius-card) 0 0;
      display: block;
    }
    h1 {
      font-family: var(--font-display);
      color: var(--color-accent);
      font-size: 1.8rem;
      margin: 0.75rem 0 0.5rem;
    }
    .field { margin-bottom: 0.5rem; line-height: 1.5; }
    .field-label {
      font-weight: bold;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #666;
      display: block;
    }
    .badge {
      display: inline-block;
      padding: 0.15rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: bold;
      color: #fff;
    }
    .badge.pristine  { background: var(--color-badge-pristine); }
    .badge.good      { background: var(--color-badge-good); }
    .badge.faded     { background: var(--color-badge-faded); }
    .badge.damaged   { background: var(--color-badge-damaged); }
    .badge.restored  { background: var(--color-badge-restored); }
    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      align-items: center;
      margin-top: var(--size-spacing-medium);
    }
    a { color: var(--color-link); }

    /* buttons */
    button {
      padding: var(--size-spacing-small) var(--size-spacing-medium);
      border-radius: 4px;
      cursor: pointer;
      background: var(--color-accent);
      color: #fff;
      border: none;
      font-family: var(--font-display);
      font-size: 0.875rem;
    }
    button.cancel-btn { background: #555; }

    /* edit form */
    form {
      display: flex;
      flex-direction: column;
      gap: var(--size-spacing-medium);
      max-width: 40rem;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-weight: bold;
      font-size: 0.875rem;
    }
    input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      font-family: var(--font-body);
    }
    .form-actions { display: flex; gap: 0.5rem; }
  `;

  constructor() {
    super();
    shadow(this)
      .styles(MuralDetailElement.styles)
      .listen({ submit: (ev: Event) => this.submitForm(ev) })
      .delegate(".edit-btn", { click: () => this.viewModel.set("mode", "edit") })
      .delegate(".cancel-btn", { click: () => this.viewModel.set("mode", "view") });

    this.viewModel.createEffect(($) => {
      if ($.muralid) Store.dispatch(this, ["mural/request", { muralid: $.muralid }]);
    });

    this.viewModel.createEffect(($) => {
      if (!$.mural) return;
      const tmpl = document.createElement("template");
      tmpl.innerHTML = $.mode === "edit"
        ? this.editFormHTML($.mural)
        : this.viewHTML($.mural);
      this.shadowRoot!.replaceChildren(tmpl.content.cloneNode(true));
    });
  }

  viewHTML(mural: Mural): string {
    return `
      <article class="mural-detail">
        <img src="/${mural.name}.jpeg"
             onerror="if(this.src.endsWith('.jpeg')){this.src=this.src.replace('.jpeg','.jpg')}else{this.style.display='none'}"
             alt="${mural.name}">
        <h1>${mural.name}</h1>
        <div class="field">
          <span class="field-label">Artist</span>${mural.artist}
        </div>
        <div class="field">${mural.description}</div>
        <div class="field">
          <span class="field-label">Address</span>${mural.address}
        </div>
        <div class="field">
          <span class="field-label">Year</span>${mural.yearMade}
        </div>
        <div class="field">
          <span class="field-label">Condition</span>
          <span class="badge ${mural.condition}">${mural.condition}</span>
        </div>
        ${mural.politicalInfluence ? `<div class="field"><span class="field-label">Political influence</span>${mural.politicalInfluence}</div>` : ""}
        <div class="actions">
          <button class="edit-btn">Edit</button>
          <button type="button" onclick="console.log('Refurbishment requested')">Request Refurbishment</button>
          <a href="/app">← Back to all murals</a>
        </div>
      </article>
    `;
  }

  editFormHTML(mural: Mural): string {
    return `
      <form>
        <h1>Edit Mural</h1>
        <label>Name <input name="name" value="${mural.name}"></label>
        <label>Artist <input name="artist" value="${mural.artist}"></label>
        <label>Description <input name="description" value="${mural.description}"></label>
        <label>Address <input name="address" value="${mural.address}"></label>
        <label>Year Made <input name="yearMade" type="number" value="${mural.yearMade}"></label>
        <label>Condition <input name="condition" value="${mural.condition}"></label>
        <label>Political Influence <input name="politicalInfluence" value="${mural.politicalInfluence || ""}"></label>
        <div class="form-actions">
          <button type="submit">Save</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    `;
  }

  submitForm(ev: Event) {
    ev.preventDefault();
    const form = ev.target as HTMLFormElement;
    const json = this.formDataToJSON(form);
    const muralid = this.viewModel.$.muralid;

    if (muralid) {
      Store.dispatch(this, [
        "mural/save",
        { muralid, mural: json as Mural },
        {
          onSuccess: () => {
            this.viewModel.set("mode", "view");
            BrowserHistory.dispatch(this, "history/navigate", {
              href: `/app/mural/${muralid}`
            });
          },
          onFailure: (error: Error) => console.log("ERROR:", error)
        }
      ]);
    }
  }

  formDataToJSON(form: HTMLFormElement): object {
    const inputs = Array.from(form.elements).filter(
      (el) => "name" in el
    ) as Array<HTMLInputElement>;
    const entries = inputs.map((el) => [el.name, el.value]);
    return Object.fromEntries(entries);
  }
}
