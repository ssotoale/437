import { Mural } from "server/models";

export interface Model {
  mural?: Mural;
  murals?: Mural[];
}

export const init: Model = {};
