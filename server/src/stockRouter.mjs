import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/", async (request, response) => {
  const tasks = await db.getStocks(request.user.sub);
  response.json(tasks);
});

router.use(express.json());
router.post("/", async (request, response) => {
  console.log(request.body);
  const stock = await db.addStock(request.body);
  response.status(201).json(stock);
});

export default router;
