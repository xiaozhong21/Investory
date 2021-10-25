import * as React from "react";

import { useParams } from "react-router-dom";

import useApi from "../auth/useApi";

const StockDetail = ({ updateWatchListButton }) => {
  const { loading, apiClient } = useApi();
  const [stock, setStock] = React.useState();
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const { ticker } = useParams();

  const loadStock = React.useCallback(
    () =>
      apiClient
        .getStockQuote(ticker)
        .then((response) => {
          setStock(response);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [apiClient, ticker],
  );

  React.useEffect(() => {
    !loading && loadStock();
  }, [loading, ticker, loadStock]);

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !stock ? (
    <p>Loading...</p>
  ) : (
    <div>
      <h2>{ticker}</h2>
      {stock.companyName} | {stock.latestPrice} |{" "}
      {stock.changePercent.toFixed(2)}
      {updateWatchListButton(stock)}
      <button type="button">Buy</button>
      <button type="button">Sell</button>
    </div>
  );
};

export default StockDetail;
