import * as React from "react";

import { Link } from "react-router-dom";

import useApi from "../auth/useApi";

const Watchlist = ({ watchlist, setWatchlist }) => {
  const { apiClient } = useApi();

  const loadWatchlist = React.useCallback(
    async () => setWatchlist(await apiClient.getWatchlist()),
    [apiClient, setWatchlist],
  );

  const handleDeleteFromWatchlist = async (ticker) => {
    await apiClient.deleteStockFromWatchlist(ticker);
    loadWatchlist();
  };

  return !watchlist.length ? (
    <section>
      <h2>You don't have any stocks in watchlist yet</h2>
    </section>
  ) : (
    <section>
      <h2>Watchlist</h2>
      <button type="button" onClick={() => loadWatchlist()}>
        Get real-time quotes
      </button>
      {watchlist.map((stock) => (
        <li key={stock.symbol}>
          <Link to={`/stocks/${stock.symbol}`}> {stock.symbol} </Link> |{" "}
          {stock.companyName} | {Number(stock.changePercent).toFixed(2)} |{" "}
          {Number(stock.latestPrice).toFixed(2)}
          <button
            type="button"
            onClick={() => handleDeleteFromWatchlist(stock.symbol)}
          >
            delete from watchlist
          </button>
        </li>
      ))}
    </section>
  );
};

export default Watchlist;
