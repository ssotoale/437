// src/routes/murals.ts
import express from "express";
import Murals from "../services/mural-svc.js";
const router = express.Router();
router.get("/", (_, res) => {
    Murals.index()
        .then((list) => res.send(list))
        .catch((err) => res.status(500).send(err));
});
router.get("/:id", (req, res) => {
    const { id } = req.params;
    Murals.get(id)
        .then((mural) => {
        if (!mural)
            res.status(404).send();
        else
            res.send(mural);
    })
        .catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
    const newMural = req.body;
    Murals.create(newMural)
        .then((mural) => res.status(201).json(mural))
        .catch((err) => res.status(500).send(err));
});
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const newMural = req.body;
    Murals.update(id, newMural)
        .then((mural) => res.json(mural))
        .catch((err) => res.status(404).end());
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    Murals.remove(id)
        .then(() => res.status(204).end())
        .catch((_) => res.status(404).end());
});
export default router;
