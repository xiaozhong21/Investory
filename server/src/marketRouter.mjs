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

router.get("/stock/:ticker/quote", (request, response) => {
  axios
    .get(
      `https://sandbox.iexapis.com/stable/stock/${request.params.ticker}/quote?displayPercent=true&token=${process.env.IEX_API_KEY}`,
    )
    .then((result) => response.json(result.data))
    .catch((error) => {
      response.status(error.response.status).end();
    });
});

router.get("/chart", (request, response) => {
  console.log(request.query.tickers, request.query.range);
  // response.json("success");
  axios
    .get(
      `https://sandbox.iexapis.com/stable/stock/market/batch?token=${process.env.IEX_API_KEY}&symbols=${request.query.tickers}&types=quote,chart&range=${request.query.range}`,
    )
    .then((result) => {
      // const tickers = Object.keys(result.data);
      // const timeLabels = Object.values(result.data)
      //   .map((stock) => stock.chart)[0]
      //   .map((dailyData) => dailyData.label);
      const returns = Object.values(result.data)
        .map((stock) => stock.chart)[0]
        .map((dailyData) => dailyData.changeOverTime * 100);
      // response.json({ tickers: tickers });
      response.json(returns);
    })
    .catch((error) => {
      response.status(error.response.status).end();
    });
});

export default router;
