import axios from "axios";
import express from "express";

import { baseApiUrl, baseApiUrl2, load_dotenv_if_exists } from "./utils.mjs";
// import { baseApiUrl, load_dotenv_if_exists } from "./utils.mjs";

load_dotenv_if_exists();

const router = express.Router();

router.get("/topGainers", async (request, response) => {
  const result = await axios.get(
    `${baseApiUrl}/market/list/gainers?displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data.filter((stock, index) => index <= 7));
});

router.get("/mostActive", async (request, response) => {
  const result = await axios.get(
    `${baseApiUrl}/market/list/mostactive?displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data);
});

router.get("/stock/:ticker/quote", (request, response) => {
  axios
    .get(
      `${baseApiUrl}/${request.params.ticker}/quote?displayPercent=true&token=${process.env.IEX_API_KEY}`,
    )
    .then((result) => response.json(result.data))
    .catch((error) => {
      response.status(error.response.status).end();
    });
});

router.get("/stock/:ticker/profile", (request, response) => {
  axios
    .get(
      `${baseApiUrl2}/${request.params.ticker}/company?token=${process.env.IEX_API_KEY2}`,
    )
    .then((result) => response.json(result.data))
    .catch((error) => {
      response.status(error.response.status).end();
    });
});

router.get("/stock/:ticker/news", (request, response) => {
  axios
    .get(
      `${baseApiUrl2}/${request.params.ticker}/news/last/3?token=${process.env.IEX_API_KEY2}`,
    )
    .then((result) => response.json(result.data))
    .catch((error) => {
      response.status(error.response.status).end();
    });
});

router.get("/chart", (request, response) => {
  const initialAmount = Number(request.query.initialAmount);
  const allocations = request.query.allocations
    .split(",")
    .map((allocation) => Number(allocation));
  axios
    .get(
      `${baseApiUrl}/market/batch?token=${process.env.IEX_API_KEY}&symbols=${request.query.tickers}&types=quote,chart&range=${request.query.range}`,
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
      const returnAndLabels = portfolioReturns.map((dailyReturn, index) => [
        new Date(timeLabels[index]).getTime(),
        dailyReturn,
      ]);
      const valueAndLabels = portfolioReturns
        .map((dailyReturn) => initialAmount * (1 + dailyReturn / 100))
        .map((dailyValue, index) => [
          new Date(timeLabels[index]).getTime(),
          dailyValue,
        ]);
      response.json({
        tickers: tickers,
        prices: prices,
        returns: returns,
        timeLabels: timeLabels,
        portfolioReturns: portfolioReturns,
        priceAndLabels: priceAndLabels,
        returnAndLabels: returnAndLabels,
        valueAndLabels: valueAndLabels,
      });
    })
    .catch((error) => {
      response.status(error.response.status).end();
    });
});

router.post("/stocks/update-quotes", async (request, response) => {
  const stocks = request.body;
  const tickers = stocks.map((stock) => stock.ticker).join(", ");
  const updatedStocklist = await axios.get(
    `${baseApiUrl}/market/batch?symbols=${tickers}&types=quote&displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(updatedStocklist.data);
});

export default router;
