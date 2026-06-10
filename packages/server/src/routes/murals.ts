// src/routes/murals.ts
import express, { Request, Response } from "express";
import { Mural } from "../models/index.ts";
import Murals from "../services/mural-svc.ts";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Murals.index()
    .then((list: Mural[]) => res.send(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params as { [key: string]: string };

  Murals.get(id)
    .then((mural: Mural | undefined) => {
      if (!mural) res.status(404).send();
      else res.send(mural);
    })
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newMural = req.body;

  Murals.create(newMural)
    .then((mural: Mural) => res.status(201).json(mural))
    .catch((err) => res.status(500).send(err));
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params as { [key: string]: string };
  const newMural = req.body;

  Murals.update(id, newMural)
    .then((mural: Mural | undefined) => res.json(mural))
    .catch((err) => res.status(404).end());
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params as { [key: string]: string };

  Murals.remove(id)
    .then(() => res.status(204).end())
    .catch((_) => res.status(404).end());
});

export default router;