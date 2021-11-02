import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/", async (request, response) => {
  const portfolios = await db.getPortfolios(request.user.sub);
  response.json(portfolios);
});

router.get("/:portfolioID", async (request, response) => {
  try {
    const portfolio = await db.getPortfolio(request.params.portfolioID);
    response.json(portfolio);
  } catch (err) {
    console.error(err);
  }
});

router.get("/:portfolioID/stocks", async (request, response) => {
  try {
    const portfolioStocks = await db.getPortfolioStocks(
      request.params.portfolioID,
    );
    response.json(portfolioStocks);
  } catch (err) {
    console.error(err);
  }
});

router.use(express.json());
router.post("/", async (request, response) => {
  const portfolio = await db.addUserPortfolio(request.user.sub, request.body);
  response.status(201).json(portfolio);
});

router.post("/:portfolioID", async (request, response) => {
  const updatedPortfolio = await db.updateUserPortfolio(
    request.params.portfolioID,
    request.body,
  );
  response.status(201).json(updatedPortfolio);
});

router.post("/:portfolioID/stocks", async (request, response) => {
  const stocksArray = request.body.map((stock) => ({
    portfolio_id: request.params.portfolioID,
    ticker: stock.ticker.toUpperCase(),
    allocation: stock.allocation,
  }));
  await db.addPortfolioStocks(stocksArray);
  response.status(201).json(stocksArray);
});

router.delete("/:portfolioID", async (request, response) => {
  await db.deletePortfolio(request.params.portfolioID);
  response.status(204).end();
});

router.delete("/:portfolioID/stocks", async (request, response) => {
  await db.deletePortfolioStocks(request.params.portfolioID);
  response.status(204).end();
});

export default router;
