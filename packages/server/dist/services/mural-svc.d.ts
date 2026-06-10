import { Mural } from "../models/index.ts";
declare function index(): Promise<Mural[]>;
declare function get(id: string): Promise<Mural | undefined>;
declare function create(json: Mural): Promise<Mural>;
declare function update(id: string, mural: Mural): Promise<Mural | undefined>;
declare function remove(id: string): Promise<void>;
declare const _default: {
    index: typeof index;
    get: typeof get;
    create: typeof create;
    update: typeof update;
    remove: typeof remove;
};
export default _default;
