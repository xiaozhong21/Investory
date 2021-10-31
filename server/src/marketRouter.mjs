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
  const allocations = request.query.allocations
    .split(",")
    .map((allocation) => Number(allocation));
  axios
    .get(
      `https://sandbox.iexapis.com/stable/stock/market/batch?token=${process.env.IEX_API_KEY}&symbols=${request.query.tickers}&types=quote,chart&range=${request.query.range}`,
    )
    .then((result) => {
      const tickers = Object.keys(result.data);
      const timeLabels = Object.values(result.data)
        .map((stock) => stock.chart)[0]
        .map((dailyData) => dailyData.date);
      const prices = Object.values(result.data)
        .map((stock) => stock.chart)[0]
        .map((dailyData) => dailyData.close);
      const returns = Object.values(result.data)
        .map((stock) => stock.chart)
        .map((stockChart) =>
          stockChart.map((dailyData) => dailyData.changeOverTime * 100),
        );
      const priceAndLabels = prices.map((price, index) => [
        new Date(timeLabels[index]).getTime(),
        price,
      ]);
      const weightedReturns = returns.map((returnArray, index) =>
        returnArray.map(
          (dailyReturn) => (dailyReturn * allocations[index]) / 100,
        ),
      );
      const portfolioReturns = weightedReturns
        .reduce((acc, ele) => {
          return acc.map((dailyReturn, index) => (dailyReturn += ele[index]));
        }, new Array(weightedReturns[0].length).fill(0))
        .map((portfolioReturn) => Number(portfolioReturn.toFixed(2)));
      const returnAndLabels = portfolioReturns.map((returns, index) => [
        new Date(timeLabels[index]).getTime(),
        returns,
      ]);
      response.json({
        tickers: tickers,
        prices: prices,
        returns: returns,
        timeLabels: timeLabels,
        portfolioReturns: portfolioReturns,
        priceAndLabels: priceAndLabels,
        returnAndLabels: returnAndLabels,
      });
    })
    .catch((error) => {
      response.status(error.response.status).end();
    });
});

export default router;
