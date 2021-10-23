import * as React from "react";

import { useParams } from "react-router-dom";

import useApi from "../auth/useApi";

const StockDetail = ({ updateWatchListButton }) => {
  const { loading, apiClient } = useApi();
  const [stock, setStock] = React.useState();
  const { ticker } = useParams();

  const getStock = React.useCallback(
    async () => setStock(await apiClient.getStockQuote(ticker)),
    [apiClient, ticker],
  );

  React.useEffect(() => {
    !loading && getStock();
  }, [loading, ticker, getStock]);

  return loading ? null : stock ? (
    <div>
      <h2>{ticker}</h2>
      {stock.companyName} | {stock.latestPrice} |{" "}
      {stock.changePercent.toFixed(2)}
      {updateWatchListButton(stock)}
    </div>
  ) : null;
};

export default StockDetail;
