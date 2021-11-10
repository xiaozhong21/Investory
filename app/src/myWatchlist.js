import * as React from "react";

import useApi from "./auth/useApi";
import emptyHeart from "./images/emptyHeart.svg";
import filledHeart from "./images/filledHeart.svg";

const MyWatchlistContext = React.createContext();

export const MyWatchlistProvider = (props) => {
  const { loading, apiClient } = useApi();
  const [watchlist, setWatchlist] = React.useState([]);

  const loadWatchlist = React.useCallback(
    async () => setWatchlist(await apiClient.getWatchlist()),
    [apiClient],
  );

  const handleAddToWatchlist = async (stock) => {
    await apiClient.addStockToWatchlist(stock.symbol);
    loadWatchlist();
  };

  const handleDeleteFromWatchlist = async (stock) => {
    await apiClient.deleteStockFromWatchlist(stock.symbol);
    loadWatchlist();
  };

  React.useEffect(() => {
    !loading && loadWatchlist();
  }, [loading, loadWatchlist]);

  const updateWatchListButton = (stock) =>
    !watchlist.map((stock) => stock.symbol).includes(stock.symbol) ? (
      <button
        type="button"
        onClick={() => handleAddToWatchlist(stock)}
        title="Add to Watchlist"
      >
        <img src={emptyHeart} alt="an empty heart" />
      </button>
    ) : (
      <button
        type="button"
        onClick={() => handleDeleteFromWatchlist(stock)}
        title="Delete from Watchlist"
      >
        <img src={filledHeart} alt="a filled heart" />
      </button>
    );

  return (
    <MyWatchlistContext.Provider
      value={{ watchlist, setWatchlist, updateWatchListButton }}
      {...props}
    />
  );
};

export const useMyWatchlist = () => React.useContext(MyWatchlistContext);
