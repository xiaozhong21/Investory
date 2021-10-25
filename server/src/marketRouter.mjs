import axios from "axios";
import express from "express";

import { load_dotenv_if_exists } from "./utils.mjs";

load_dotenv_if_exists();

const router = express.Router();

router.get("/topGainers", async (request, response) => {
  const result = await axios.get(
    `https://sandbox.iexapis.com/stable/stock/market/list/gainers?displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data);
});

router.get("/mostActive", async (request, response) => {
  const result = await axios.get(
    `https://sandbox.iexapis.com/stable/stock/market/list/mostactive?displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data);
});

router.get("/stock/:ticker/quote", async (request, response) => {
  const result = await axios.get(
    `https://sandbox.iexapis.com/stable/stock/${request.params.ticker}/quote?displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data);
});

export default router;
