import * as React from "react";

import { Link } from "react-router-dom";

import useApi from "../auth/useApi";

import burnFire from "./burnFire.svg";
import lineChartUp from "./lineChartUp.svg";
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
    <section className={styles.discover}>
      <div>
        <h2 className={styles.header}>
          <img src={lineChartUp} alt="uptrend line chart icon" />
          <span>Top Gainers</span>
        </h2>
        <TopGainersList {...{ topGainers, updateWatchListButton }} />
      </div>
      <div>
        <h2 className={styles.header}>
          <img src={burnFire} alt="fire icon" />
          <span>Most Active</span>
        </h2>
        <MostActiveList {...{ mostActive, updateWatchListButton }} />
      </div>
    </section>
  );
};

const TopGainersList = ({ topGainers, updateWatchListButton }) => (
  <ul className={styles.gainers}>
    {topGainers.map((stock) => (
      <li key={stock.symbol}>
        <Link to={`/stocks/${stock.symbol}`}>
          <button className={styles.symbol}>{stock.symbol}</button>
          <span className={styles.changePercent}>
            +{stock.changePercent?.toFixed(2) + "%"}
          </span>
          <span>${stock.latestPrice?.toFixed(2)}</span>
        </Link>
        {updateWatchListButton(stock)}
      </li>
    ))}
  </ul>
);

const MostActiveList = ({ mostActive, updateWatchListButton }) => (
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Company Name</th>
        <th>Change from Last Day</th>
        <th>Latest Price</th>
        <th>Watchlist Status</th>
      </tr>
    </thead>
    <tbody>
      {mostActive.map((stock) => (
        <tr key={stock.symbol}>
          <td className={styles.leftAlign}>
            <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link>
          </td>
          <td className={styles.leftAlign}>
            <Link to={`/stocks/${stock.symbol}`}>{stock.companyName}</Link>
          </td>
          <td>
            <Link
              to={`/stocks/${stock.symbol}`}
              className={
                stock.changePercent > 0 ? styles.positive : styles.negative
              }
            >
              {stock.changePercent > 0 ? "+" : null}
              {stock.changePercent
                ? stock.changePercent.toFixed(2) + "%"
                : "N/A"}
            </Link>
          </td>
          <td>
            <Link to={`/stocks/${stock.symbol}`}>
              {stock.latestPrice?.toFixed(2)}
            </Link>
          </td>
          <td>{updateWatchListButton(stock)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Discover;
