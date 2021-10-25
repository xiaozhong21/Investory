import express from "express";

import * as db from "./db.mjs";

const router = express.Router();

router.get("/", async (request, response) => {
  const portfolios = await db.getPortfolios(request.user.sub);
  response.json(portfolios);
});

router.use(express.json());
router.post("/", async (request, response) => {
  const portfolio = await db.addUserPortfolio(request.user.sub);
  response.status(201).json(portfolio);
});

export default router;
