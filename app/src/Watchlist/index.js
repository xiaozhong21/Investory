import * as React from "react";

import useApi from "../auth/useApi";

const Watchlist = () => {
  const { loading, apiClient } = useApi();
  const [watchlist, setWatchlist] = React.useState([]);

  const loadWatchlist = React.useCallback(
    async () => setWatchlist(await apiClient.getWatchlist()),
    [apiClient],
  );

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
