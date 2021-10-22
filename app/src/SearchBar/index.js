import * as React from "react";

import useApi from "../auth/useApi";

const SearchBar = () => {
  const [ticker, setTicker] = React.useState("");
  const { loading, apiClient } = useApi();

  const canAdd = ticker !== "";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (canAdd) {
      const stock = await apiClient.getStockQuote(ticker);
      await apiClient.addOrUpdateStock(stock);
      const stockToBeAdded = await apiClient.getStockByTicker(
        ticker.toUpperCase(),
      );
      await apiClient.addStockToWatchlist(stockToBeAdded.id);
      setTicker("");
    }
  };

  return loading ? null : (
    <form {...{ onSubmit }}>
      <label>
        <input
          onChange={(e) => setTicker(e.currentTarget.value)}
          value={ticker}
          placeholder="Search by Ticker"
        />
      </label>
      <button disabled={!canAdd}>Add to Watchlist</button>
    </form>
  );
};

export default SearchBar;
