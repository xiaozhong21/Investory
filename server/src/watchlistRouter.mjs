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
    request.body.ticker,
  );
  response.status(201).json(stock);
});

router.delete("/:ticker", async (request, response) => {
  await db.deleteStockFromWatchlist(request.user.sub, request.params.ticker);
  response.status(204).end();
});

export default router;
