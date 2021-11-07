import * as React from "react";

import { useParams } from "react-router-dom";

import useApi from "../auth/useApi";
import barChart from "../images/barChart.svg";
import notification from "../images/notification.svg";
import { convertNumToThousandths } from "../utils.js";

import StockChart from "./StockChart";
import styles from "./styles.module.scss";

const StockDetail = ({ updateWatchListButton }) => {
  const { loading, apiClient } = useApi();
  const [stock, setStock] = React.useState();
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [stockNews, setStockNews] = React.useState();
  const { ticker } = useParams();

  const loadStock = React.useCallback(
    () =>
      apiClient
        .getStockQuote(ticker)
        .then((response) => {
          setStock(response);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [apiClient, ticker],
  );

  const loadStockNews = React.useCallback(
    () =>
      apiClient
        .getStockNews(ticker)
        .then((response) => {
          setStockNews(response);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [apiClient, ticker],
  );

  React.useEffect(() => {
    !loading && loadStock();
  }, [loading, ticker, loadStock]);

  React.useEffect(() => {
    !loading && loadStockNews();
  }, [loading, ticker, loadStockNews]);

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !stock || !stockNews ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.stockDetail}>
      <div className={styles.chartAndPrice}>
        <StockChart {...{ ticker }} />
        <div className={styles.priceInfo}>
          <h2>
            {ticker.toUpperCase()} {updateWatchListButton(stock)}
          </h2>
          <p>{stock.companyName}</p>
          <p className={styles.price}>${stock.latestPrice.toFixed(2)}</p>
          <p className={stock.change > 0 ? styles.positive : styles.negative}>
            {stock.change} ({stock.changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>
      <div className={styles.keyInfoAndNews}>
        <div className={styles.keyInfo}>
          <h2 className={styles.header}>
            <img src={barChart} alt="barChart icon" />
            <span>Key Info</span>
          </h2>
          <div className={styles.keyInfoContent}>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>Open</p>
              <p>${stock.open.toFixed(2)}</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>High</p>
              <p>${stock.high.toFixed(2)}</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>Low</p>
              <p>${stock.low.toFixed(2)}</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>52-week High</p>
              <p>${stock.week52High.toFixed(2)}</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>52-week Low</p>
              <p>${stock.week52Low.toFixed(2)}</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>YTD Change</p>
              <p>{stock.ytdChange.toFixed(2)}%</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>Market Cap</p>
              <p>{convertNumToThousandths(stock.marketCap)}</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>P/E Ratio</p>
              <p>{stock.peRatio}</p>
            </div>
            <div className={styles.keyInfoStat}>
              <p className={styles.keyInfoKey}>Volume</p>
              <p>{convertNumToThousandths(stock.volume)}</p>
            </div>
          </div>
        </div>
        <div className={styles.news}>
          <h2 className={styles.header}>
            <img src={notification} alt="notification icon" />
            <span>Latest News</span>
          </h2>
          <ul className={styles.newsContent}>
            {stockNews.map((news, index) => (
              <li key={index}>{news.headline}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
