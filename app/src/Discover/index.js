import * as React from "react";

import useApi from "../auth/useApi";
import useAuth0 from "../auth/useAuth0";

import styles from "./styles.module.scss";

const Discover = () => {
  const { user } = useAuth0();

  const [topGainers, setTopGainers] = React.useState([]);
  const [mostActive, setMostActive] = React.useState([]);
  const [stocks, setStocks] = React.useState();
  const { loading, apiClient } = useApi();

  const loadTopGainers = React.useCallback(
    async () => setTopGainers(await apiClient.getTopGainers()),
    [apiClient],
  );

  const loadMostActive = React.useCallback(
    async () => setMostActive(await apiClient.getMostActive()),
    [apiClient],
  );

  React.useEffect(() => {
    !loading && loadTopGainers();
    !loading && loadMostActive();
  }, [loading, loadTopGainers, loadMostActive]);

  const handleAddToWatchlist = (stock) => {
    apiClient.addStock(stock);
    // followStock(stock);
  };

  const addToWatchListButton = (stock) => (
    <button type="button" onClick={() => handleAddToWatchlist(stock)}>
      add to watchlist
    </button>
  );

  return loading ? null : (
    <section>
      {user.given_name}
      <h2>Top Gainers</h2>
      <TopGainersList {...{ topGainers, addToWatchListButton }} />
      <h2>Most Active</h2>
      <MostActiveList {...{ mostActive, addToWatchListButton }} />
    </section>
  );
};

const TopGainersList = ({ topGainers, addToWatchListButton }) => (
  <ul>
    {topGainers.map((stock) => (
      <li key={stock.symbol}>
        {stock.symbol} | {stock.changePercent?.toFixed(2)} |
        {stock.latestPrice?.toFixed(2)}
        {addToWatchListButton(stock)}
      </li>
    ))}
  </ul>
);

const MostActiveList = ({ mostActive, addToWatchListButton }) => (
  <ul>
    {mostActive.map((stock) => (
      <li key={stock.symbol}>
        {stock.symbol} | {stock.companyName} | {stock.changePercent?.toFixed(2)}{" "}
        | {stock.latestPrice?.toFixed(2)}
        {addToWatchListButton(stock)}
      </li>
    ))}
  </ul>
);

export default Discover;
