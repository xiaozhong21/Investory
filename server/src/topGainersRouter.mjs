import axios from "axios";
import express from "express";

const router = express.Router();

router.get("/", async (request, response) => {
  const result = await axios.get(
    `https://sandbox.iexapis.com/stable/stock/market/list/gainers?displayPercent=true&token=${process.env.IEX_API_KEY}`,
  );
  response.json(result.data);
});

export default router;
