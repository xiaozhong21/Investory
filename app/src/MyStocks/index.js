import * as React from "react";

import { Link } from "react-router-dom";

import useApi from "../auth/useApi";

const MyStocks = ({ watchlist, setWatchlist }) => {
  const { loading } = useApi();
  const [portfolio, setPortfolio] = React.useState([]);

  return loading ? null : (
    <>
      <Portfolio {...{ portfolio, setPortfolio }} />
      <Watchlist {...{ watchlist, setWatchlist }} />
    </>
  );
};

const Portfolio = ({ portfolio, setPortfolio }) => {
  return portfolio.length === 0 ? (
    <section>
      <h2>You don't have any stocks in portfolio yet</h2>
    </section>
  ) : (
    <section>
      <h2>Watchlist</h2>
    </section>
  );
};

const Watchlist = ({ watchlist, setWatchlist }) => {
  const { apiClient } = useApi();

  const loadWatchlist = React.useCallback(
    async () => setWatchlist(await apiClient.getWatchlist()),
    [apiClient, setWatchlist],
  );

  const updateStockQuotes = async (stocks) => {
    await apiClient.updateStockQuotes(stocks);
    loadWatchlist();
  };

  const handleDeleteFromWatchlist = async (stock) => {
    await apiClient.deleteStockFromWatchlist(stock.ticker);
    loadWatchlist();
  };

  return watchlist.length === 0 ? (
    <section>
      <h2>You don't have any stocks in watchlist yet</h2>
    </section>
  ) : (
    <section>
      <h2>Watchlist</h2>
      <button type="button" onClick={() => updateStockQuotes(watchlist)}>
        Get real-time quotes
      </button>
      {watchlist.map((stock) => (
        <li key={stock.ticker}>
          <Link to={`/stocks/${stock.ticker}`}> {stock.ticker} </Link> |{" "}
          {stock.company_name} | {Number(stock.change_percent).toFixed(2)} |{" "}
          {Number(stock.latest_price).toFixed(2)}
          <button
            type="button"
            onClick={() => handleDeleteFromWatchlist(stock)}
          >
            delete from watchlist
          </button>
        </li>
      ))}
    </section>
  );
};

export default MyStocks;
