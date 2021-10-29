import axios from "axios";
import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/", async (request, response) => {
  const watchlist = await db.getWatchlist(request.user.sub);
  if (watchlist.length !== 0) {
    const tickers = watchlist.map((stock) => stock.ticker).join(", ");
    const updatedWatchlist = await axios.get(
      `https://sandbox.iexapis.com/stable/stock/market/batch?symbols=${tickers}&types=quote&displayPercent=true&token=${process.env.IEX_API_KEY}`,
    );
    const updateWatchlistArray = [];
    for (let stock in updatedWatchlist.data) {
      updateWatchlistArray.push(updatedWatchlist.data[stock].quote);
    }
    response.json(updateWatchlistArray);
  } else {
    response.json([]);
  }
});

router.use(express.json());
router.post("/stocks", async (request, response) => {
  const stock = await db.addStockToWatchlist(
    request.user.sub,
    request.body.ticker,
  );
  response.status(201).json(stock);
});

router.delete("/stocks/:ticker", async (request, response) => {
  await db.deleteStockFromWatchlist(request.user.sub, request.params.ticker);
  response.status(204).end();
});

export default router;
