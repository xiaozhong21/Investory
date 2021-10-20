import * as React from "react";

import useApi from "../auth/useApi";

import styles from "./styles.module.scss";

const Discover = () => {
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
    !loading && loadTopGainers();
  }, [loading, loadTopGainers]);

  React.useEffect(() => {
    !loading && loadMostActive();
  }, [loading, loadMostActive]);

  return loading ? null : (
    <section>
      <h2>Top Gainers</h2>
      <TopGainersList {...{ topGainers }} />
      <h2>Most Active</h2>
      <MostActiveList {...{ mostActive }} />
    </section>
  );
};

const TopGainersList = ({ topGainers }) => (
  <ul>
    {topGainers.map(({ symbol, latestPrice, changePercent }) => (
      <li key={symbol}>
        {symbol} | {changePercent.toFixed(2)} |{latestPrice.toFixed(2)}
      </li>
    ))}
  </ul>
);

const MostActiveList = ({ mostActive }) => (
  <ul>
    {mostActive.map(({ symbol, companyName, latestPrice, changePercent }) => (
      <li key={symbol}>
        {symbol} | {companyName} | {changePercent.toFixed(2)} |{" "}
        {latestPrice.toFixed(2)}
      </li>
    ))}
  </ul>
);

export default Discover;
