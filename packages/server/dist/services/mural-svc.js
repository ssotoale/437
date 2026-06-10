// src/services/mural-svc.ts
import { Schema, model } from "mongoose";
const muralSchema = new Schema({
    name: String,
    artist: String,
    description: String,
    address: String,
    featuredImage: String,
    yearMade: Number,
    condition: { type: String },
    politicalInfluence: { type: String },
}, { collection: "murals" });
const MuralModel = model("Mural", muralSchema);
function index() {
    return MuralModel.find();
}
function get(id) {
    return MuralModel.findById(id)
        .then((found) => found ?? undefined)
        .catch(() => {
        throw `${id} Not Found`;
    });
}
function create(json) {
    const t = new MuralModel(json);
    return t.save();
}
function update(id, mural) {
    return MuralModel.findOneAndUpdate({ _id: id }, mural, {
        new: true
    }).then((updated) => {
        if (!updated)
            throw `${id} not updated`;
        else
            return updated;
    });
}
function remove(id) {
    return MuralModel.findOneAndDelete({ _id: id }).then((deleted) => {
        if (!deleted)
            throw `${id} not deleted`;
    });
}
export default { index, get, create, update, remove };
