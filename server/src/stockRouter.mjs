import axios from "axios";
import express from "express";

import * as db from "./db.mjs";
import { load_dotenv_if_exists } from "./utils.mjs";

load_dotenv_if_exists();

const router = express.Router();

router.use(express.json());
router.post("/", async (request, response) => {
  const stock = await db.addOrUpdateStock(request.body);
  response.status(201).json(stock);
});

router.post("/update-quotes", async (request, response) => {
  const stocks = request.body;
  const tickers = stocks.map((stock) => stock.ticker).join(", ");
  const updatedStocklist = await axios.get(
    `https://sandbox.iexapis.com/stable/stock/market/batch?symbols=${tickers}&types=quote&displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(updatedStocklist.data);
});

export default router;
