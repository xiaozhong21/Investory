import * as React from "react";

import { Link } from "react-router-dom";

import useApi from "../auth/useApi";
import fileOpen from "../images/fileOpen.svg";
import infoCircle from "../images/infoCircle.svg";
import refresh from "../images/refresh.svg";
import trashCan from "../images/trashCan.svg";
import { useMyWatchlist } from "../myWatchlist";
import { convertNumToThousandths } from "../utils.js";

import styles from "./styles.module.scss";

const Watchlist = () => {
  const { watchlist, setWatchlist } = useMyWatchlist();
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
    <section className={styles.addStockReminder}>
      <h2>
        <img src={infoCircle} alt="information icon" />
        You don't have any stocks in watchlist yet
      </h2>
      <h3>
        <Link to={"/discover"}>Get inspirations</Link> from daily top gainers
        and active stocks
      </h3>
    </section>
  ) : (
    <section className={styles.watchlist}>
      <div className={styles.text}>
        <h2 className={`${styles.header} ${styles.watchlistHeader}`}>
          <img src={fileOpen} alt="open file icon" />
          <span>My Watchlist</span>
          <button
            type="button"
            onClick={() => loadWatchlist()}
            title="refresh stock quotes"
          >
            <img src={refresh} alt="refresh icon" />
          </button>
        </h2>
        <p>(Click on individual stock to view stock details)</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Company Name</th>
            <th>Daily Change</th>
            <th>Latest Price</th>
            <th>Trading Volume</th>
            <th>Unwatch</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((stock) => (
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
                  ${stock.latestPrice?.toFixed(2)}
                </Link>
              </td>
              <td>
                <Link to={`/stocks/${stock.symbol}`}>
                  {convertNumToThousandths(stock.iexVolume)}
                </Link>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => handleDeleteFromWatchlist(stock.symbol)}
                  title="Delete from Watchlist"
                >
                  <img src={trashCan} alt="a full trash can" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {watchlist.map((stock) => (
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
      ))} */}
    </section>
  );
};

export default Watchlist;
