import { Mural } from "server/models";

export type Msg =
  | ["mural/request", { muralid: string }]
  | ["mural/load", { mural: Mural }]
  | ["murals/request", {}]
  | ["murals/load", { murals: Mural[] }]
  | ["mural/save", { muralid: string; mural: Mural }, { onSuccess?: () => void; onFailure?: (err: Error) => void }];
