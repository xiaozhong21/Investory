import axios from "axios";
import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/:ticker", async (request, response) => {
  const stock = await db.getStockByTicker(request.params.ticker);
  response.json(stock);
});

router.get("/quote/:ticker", async (request, response) => {
  const result = await axios.get(
    `https://sandbox.iexapis.com/stable/stock/${request.params.ticker}/quote?displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data);
});

router.get("/quotes/:tickerList", async (request, response) => {
  const result = await axios.get(
    `https://sandbox.iexapis.com/stable/stock/market/batch?symbols=${request.params.tickerList}&types=quote&displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data);
});

router.use(express.json());
router.post("/", async (request, response) => {
  console.log(request.body);
  const stock = await db.addOrUpdateStock(request.body);
  response.status(201).json(stock);
});

export default router;
