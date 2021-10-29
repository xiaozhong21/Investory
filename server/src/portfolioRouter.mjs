import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/", async (request, response) => {
  const portfolios = await db.getPortfolios(request.user.sub);
  response.json(portfolios);
});

router.get("/:portfolioID/stocks", async (request, response) => {
  const portfolioStocks = await db.getPortfolioStocks(
    request.params.portfolioID,
  );
  response.json(portfolioStocks);
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

router.delete("/:portfolioID", async (request, response) => {
  await db.deletePortfolio(request.params.portfolioID);
  response.status(204).end();
});

export default router;
