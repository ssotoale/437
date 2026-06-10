import { Auth } from "@unbndl/auth";
import { Mural } from "server/models";
import { Model } from "./model.ts";
import { Msg } from "./messages.ts";

export type Cmd =
  | ["mural/load", { mural: Mural }]
  | ["murals/load", { murals: Mural[] }];

export function update(
  model: Model,
  message: Msg | Cmd,
  auth: Auth.Model
): Model | [Model, Promise<Cmd>] {
  const [type, payload] = message;
  switch (type) {
    case "murals/request": {
      return [
        { ...model, murals: [] },
        requestMurals(auth)
      ];
    }
    case "murals/load": {
      const { murals } = payload as { murals: Mural[] };
      return { ...model, murals };
    }
    case "mural/request": {
      const { muralid } = payload as { muralid: string };
      if (model.mural?._id === muralid) break;
      return [
        { ...model, mural: undefined },
        requestMural({ muralid }, auth)
      ];
    }
    case "mural/load": {
      const { mural } = payload as { mural: Mural };
      return { ...model, mural };
    }
    case "mural/save": {
      const { muralid, mural } = payload as { muralid: string; mural: Mural };
      const callbacks = (message as any)[2] as { onSuccess?: () => void; onFailure?: (err: Error) => void } | undefined;
      return [model, saveMural({ muralid, mural }, auth, callbacks)];
    }
    default: {
      const unhandled: never = type;
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
  return model;
}

function requestMurals(auth: Auth.Model): Promise<Cmd> {
  return fetch("/api/murals", {
    headers: Auth.headers(auth)
  })
    .then((res) => res.json())
    .then((murals) => ["murals/load", { murals }] as Cmd);
}

function requestMural(
  payload: { muralid: string },
  auth: Auth.Model
): Promise<Cmd> {
  return fetch(`/api/murals/${payload.muralid}`, {
    headers: Auth.headers(auth)
  })
    .then((res) => res.json())
    .then((mural) => ["mural/load", { mural }] as Cmd);
}

function saveMural(
  payload: { muralid: string; mural: Mural },
  auth: Auth.Model,
  callbacks?: { onSuccess?: () => void; onFailure?: (err: Error) => void }
): Promise<Cmd> {
  return fetch(`/api/murals/${payload.muralid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(auth)
    },
    body: JSON.stringify(payload.mural)
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();
      throw new Error(`${res.status} saving mural ${payload.muralid}`);
    })
    .then((json: unknown) => {
      if (json) {
        callbacks?.onSuccess?.();
        return ["mural/load", { mural: json as Mural }] as Cmd;
      }
      throw new Error("No JSON in API response");
    })
    .catch((err: Error) => {
      callbacks?.onFailure?.(err);
      throw err;
    });
}
