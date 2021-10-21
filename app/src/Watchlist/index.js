import * as React from "react";

import useApi from "../auth/useApi";

const Watchlist = () => {
  const { loading, apiClient } = useApi();
  const [watchlist, setWatchlist] = React.useState([]);

  const loadWatchlist = React.useCallback(
    async () => setWatchlist(await apiClient.getWatchlist()),
    [apiClient],
  );

  const refreshStocklist = async (stocklist) => {
    const stocklistTickers = stocklist.map((stock) => stock.ticker).join(", ");
    const updatedStocklist = await apiClient.getBatchStockQuotes(
      stocklistTickers,
    );
    for (let key in updatedStocklist) {
      await apiClient.addOrUpdateStock(updatedStocklist[key].quote);
    }
    loadWatchlist();
  };

  React.useEffect(() => {
    !loading && loadWatchlist();
  }, [loading, loadWatchlist]);

  const handleDeleteFromWatchlist = async (stock) => {
    const stockToBeDeleted = await apiClient.getStockByTicker(stock.ticker);
    await apiClient.deleteStockFromWatchlist(stockToBeDeleted.id);
    loadWatchlist();
  };

  return loading ? null : (
    <section>
      <h2>Watchlist</h2>
      <button type="button" onClick={() => refreshStocklist(watchlist)}>
        Get real-time quotes
      </button>
      {watchlist.map((stock) => (
        <li key={stock.ticker}>
          {stock.ticker} | {stock.company_name} |{" "}
          {Number(stock.change_percent).toFixed(2)} |{" "}
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

export default Watchlist;
