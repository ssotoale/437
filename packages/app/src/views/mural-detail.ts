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
    :host { display: block; padding: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
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
        <h1>${mural.name}</h1>
        <p>Artist: ${mural.artist}</p>
        <p>${mural.description}</p>
        <p>Address: ${mural.address}</p>
        <p>Year: ${mural.yearMade}</p>
        <p>Condition: ${mural.condition}</p>
        ${mural.politicalInfluence ? `<p>Political influence: ${mural.politicalInfluence}</p>` : ""}
        <button class="edit-btn">Edit</button>
        <a href="/app">← Back to all murals</a>
      </article>
    `;
  }

  editFormHTML(mural: Mural): string {
    return `
      <form>
        <label>Name: <input name="name" value="${mural.name}"></label>
        <label>Artist: <input name="artist" value="${mural.artist}"></label>
        <label>Description: <input name="description" value="${mural.description}"></label>
        <label>Address: <input name="address" value="${mural.address}"></label>
        <label>Year Made: <input name="yearMade" type="number" value="${mural.yearMade}"></label>
        <label>Condition: <input name="condition" value="${mural.condition}"></label>
        <label>Political Influence: <input name="politicalInfluence" value="${mural.politicalInfluence || ""}"></label>
        <button type="submit">Save</button>
        <button type="button" class="cancel-btn">Cancel</button>
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
