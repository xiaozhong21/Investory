import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/", async (request, response) => {
  const portfolios = await db.getPortfolios(request.user.sub);
  response.json(portfolios);
});

router.use(express.json());
router.post("/", async (request, response) => {
  const portfolio = await db.addUserPortfolio(request.user.sub, request.body);
  response.status(201).json(portfolio);
});

router.post("/:portfolioID/stocks", async (request, response) => {
  const stocksArray = request.body;
  for (let stock of stocksArray) {
    await db.addPortfolioStocks(
      request.params.portfolioID,
      stock.ticker.toUpperCase(),
      stock.allocation,
    );
  }
  response.status(201).json(stocksArray);
});

export default router;
