import * as React from "react";

import { Link } from "react-router-dom";

import useApi from "../auth/useApi";

import styles from "./styles.module.scss";

const Discover = ({ updateWatchListButton }) => {
  const [topGainers, setTopGainers] = React.useState([]);
  const [mostActive, setMostActive] = React.useState([]);
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
    !loading && loadTopGainers() && loadMostActive();
  }, [loading, loadTopGainers, loadMostActive]);

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
        <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link> |{" "}
        {stock.changePercent?.toFixed(2)} |{stock.latestPrice?.toFixed(2)}
        {updateWatchListButton(stock)}
      </li>
    ))}
  </ul>
);

const MostActiveList = ({ mostActive, updateWatchListButton }) => (
  <ul>
    {mostActive.map((stock) => (
      <li key={stock.symbol}>
        <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link> |{" "}
        {stock.companyName} | {stock.changePercent?.toFixed(2)} |
        {stock.latestPrice?.toFixed(2)}
        {updateWatchListButton(stock)}
      </li>
    ))}
  </ul>
);

export default Discover;
