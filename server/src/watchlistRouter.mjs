import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/", async (request, response) => {
  const watchlist = await db.getWatchlist(request.user.sub);
  response.json(watchlist);
});

router.use(express.json());
router.post("/", async (request, response) => {
  const stock = await db.addStockToWatchlist(
    request.user.sub,
    request.body.stockID,
  );
  response.status(201).json(stock);
});

router.delete("/:stockID", async (request, response) => {
  await db.deleteStockFromWatchlist(request.user.sub, request.params.stockID);
  response.status(204).end();
});

export default router;
