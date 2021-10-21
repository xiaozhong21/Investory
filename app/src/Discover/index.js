import * as React from "react";

import useApi from "../auth/useApi";
import useAuth0 from "../auth/useAuth0";

import styles from "./styles.module.scss";

const Discover = () => {
  const { user } = useAuth0();

  const [topGainers, setTopGainers] = React.useState([]);
  const [mostActive, setMostActive] = React.useState([]);
  const [watchlist, setWatchlist] = React.useState([]);
  const { loading, apiClient } = useApi();

  const loadTopGainers = React.useCallback(
    async () => setTopGainers(await apiClient.getTopGainers()),
    [apiClient],
  );

  const loadMostActive = React.useCallback(
    async () => setMostActive(await apiClient.getMostActive()),
    [apiClient],
  );

  const loadWatchlist = React.useCallback(
    async () => setWatchlist(await apiClient.getWatchlist()),
    [apiClient],
  );

  React.useEffect(() => {
    !loading && loadTopGainers();
    !loading && loadMostActive();
  }, [loading, loadTopGainers, loadMostActive]);

  React.useEffect(() => {
    !loading && loadWatchlist();
  }, [loading, loadWatchlist]);

  const handleAddToWatchlist = async (stock) => {
    await apiClient.addOrUpdateStock(stock);
    const stockToBeAdded = await apiClient.getStockByTicker(stock.symbol);
    await apiClient.addStockToWatchlist(stockToBeAdded.id);
    loadWatchlist();
  };

  const handleDeleteFromWatchlist = async (stock) => {
    const stockToBeDeleted = await apiClient.getStockByTicker(stock.symbol);
    await apiClient.deleteStockFromWatchlist(stockToBeDeleted.id);
    loadWatchlist();
  };

  const updateWatchListButton = (stock) =>
    !watchlist.map((stock) => stock.ticker).includes(stock.symbol) ? (
      <button type="button" onClick={() => handleAddToWatchlist(stock)}>
        add to watchlist
      </button>
    ) : (
      <button type="button" onClick={() => handleDeleteFromWatchlist(stock)}>
        delete from watchlist
      </button>
    );

  return loading ? null : (
    <section>
      <h2>Top Gainers</h2>
      <TopGainersList {...{ topGainers, updateWatchListButton }} />
      <h2>Most Active</h2>
      <MostActiveList {...{ mostActive, updateWatchListButton }} />
    </section>
  );
};

const TopGainersList = ({ topGainers, updateWatchListButton }) => (
  <ul>
    {topGainers.map((stock) => (
      <li key={stock.symbol}>
        {stock.symbol} | {stock.changePercent?.toFixed(2)} |
        {stock.latestPrice?.toFixed(2)}
        {updateWatchListButton(stock)}
      </li>
    ))}
  </ul>
);

const MostActiveList = ({ mostActive, updateWatchListButton }) => (
  <ul>
    {mostActive.map((stock) => (
      <li key={stock.symbol}>
        {stock.symbol} | {stock.companyName} | {stock.changePercent?.toFixed(2)}{" "}
        | {stock.latestPrice?.toFixed(2)}
        {updateWatchListButton(stock)}
      </li>
    ))}
  </ul>
);

export default Discover;
