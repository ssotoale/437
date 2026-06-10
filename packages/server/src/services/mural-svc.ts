// src/services/mural-svc.ts
import { Schema, model } from "mongoose";
import { Mural } from "../models/index.ts";

const muralSchema = new Schema<Mural>(
  {
    name: String,
    artist: String,
    description: String,
    address: String,
    featuredImage: String,
    yearMade: Number,
    condition: { type: String },
    politicalInfluence: { type: String },
  },
  { collection: "murals" }
);

const MuralModel = model<Mural>("Mural", muralSchema);

function index(): Promise<Mural[]> {
  return MuralModel.find();
}

function get(id: string): Promise<Mural | undefined> {
  return MuralModel.findById(id)
    .then((found) => found ?? undefined)
    .catch(() => {
      throw `${id} Not Found`;
    });
}

function create(json: Mural): Promise<Mural> {
  const t = new MuralModel(json);
  return t.save();
}

function update(
  id: string,
  mural: Mural
): Promise<Mural | undefined> {
  return MuralModel.findOneAndUpdate({ _id: id }, mural, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated as Mural;
  });
}

function remove(id: string): Promise<void> {
  return MuralModel.findOneAndDelete({ _id: id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };