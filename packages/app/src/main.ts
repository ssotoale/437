import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { Store } from "@unbndl/store";
import { BrowserHistory, Switch } from "@unbndl/switch";
import { Msg } from "./messages.ts";
import { Model, init } from "./model.ts";
import { update, Cmd } from "./update.ts";
import { MuralHeaderElement } from "./components/mural-header.ts";
import { HomeViewElement } from "./views/home-view.ts";
import { MuralDetailElement } from "./views/mural-detail.ts";

const routes: any[] = [
  {
    path: "/app/mural/:id",
    view: html`<mural-detail mural-id=${($: any) => $.params.id}></mural-detail>`
  },
  {
    path: "/app",
    view: html`<home-view></home-view>`
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "auth-provider": Auth.Provider,
  "history-provider": BrowserHistory.Provider,
  "store-provider": class AppStore extends Store.Provider<Model, Msg, Cmd> {
    constructor() {
      super(update, init);
    }
  },
  "router-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes as any);
    }
  },
  "mural-header": MuralHeaderElement,
  "home-view": HomeViewElement,
  "mural-detail": MuralDetailElement
});
