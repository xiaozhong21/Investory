import * as React from "react";

import { useParams } from "react-router-dom";

import useApi from "../auth/useApi";
import barChart from "../images/barChart.svg";
import circleStar from "../images/circleStar.svg";
import lineChartUp from "../images/lineChartUp.svg";
import newspaper from "../images/newspaper.svg";
import {
  convertNumToThousandths,
  epochTimeConverter,
  bigNumConverter,
} from "../utils.js";

import StockChart from "./StockChart";
import styles from "./styles.module.scss";

const StockDetail = ({ updateWatchListButton }) => {
  const { loading, apiClient } = useApi();
  const [stock, setStock] = React.useState();
  const [companyProfile, setCompanyProfile] = React.useState();
  const [stockNews, setStockNews] = React.useState();
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
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

  const loadCompanyProfle = React.useCallback(
    () =>
      apiClient
        .getCompanyProfile(ticker)
        .then((response) => {
          setCompanyProfile(response);
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
    !loading && loadCompanyProfle();
  }, [loading, ticker, loadCompanyProfle]);

  React.useEffect(() => {
    !loading && loadStockNews();
  }, [loading, ticker, loadStockNews]);

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !stock || !stockNews || !companyProfile ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.stockDetail}>
      <div className={styles.chartAndPrice}>
        <h2 className={styles.header}>
          <img src={lineChartUp} alt="lineChartUp icon" />
          <span>Chart</span>
        </h2>
        <div className={styles.priceChartContent}>
          <StockChart {...{ ticker }} />
          <div className={styles.priceInfo}>
            <h2>
              {ticker.toUpperCase()} {updateWatchListButton(stock)}
            </h2>
            <p>{stock.companyName}</p>
            <p className={styles.price}>
              ${convertNumToThousandths(stock.latestPrice.toFixed(2))}
            </p>
            <p className={stock.change > 0 ? styles.positive : styles.negative}>
              {stock.change} ({stock.changePercent.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>
      <div className={styles.companyProfile}>
        <h2 className={styles.header}>
          <img src={circleStar} alt="start in a circle icon" />
          <span>About {ticker.toUpperCase()}</span>
        </h2>
        <div className={styles.profileContent}>
          {companyProfile.description}
        </div>
      </div>
      <div className={styles.keyInfo}>
        <h2 className={styles.header}>
          <img src={barChart} alt="barChart icon" />
          <span>Stats</span>
        </h2>
        <div className={styles.keyInfoContent}>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>Open</p>
            <p>${stock.iexOpen.toFixed(2) || "-"}</p>
          </div>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>52-week High</p>
            <p>${stock.week52High.toFixed(2) || "-"}</p>
          </div>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>52-week Low</p>
            <p>${stock.week52Low.toFixed(2) || "-"}</p>
          </div>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>YTD Change</p>
            <p>{stock.ytdChange.toFixed(2) || "-"}%</p>
          </div>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>Market Cap</p>
            <p>{bigNumConverter(stock.marketCap) || "-"}</p>
          </div>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>P/E Ratio</p>
            <p>{stock.peRatio || "-"}</p>
          </div>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>Avg Volume</p>
            <p>{bigNumConverter(stock.avgTotalVolume) || "-"}</p>
          </div>
          <div className={styles.keyInfoStat}>
            <p className={styles.keyInfoKey}>Volume</p>
            <p>{bigNumConverter(stock.iexVolume) || "-"}</p>
          </div>
        </div>
      </div>
      <div className={styles.news}>
        <h2 className={styles.header}>
          <img src={newspaper} alt="newspaper icon" />
          <span>Latest News</span>
        </h2>
        <ul>
          {stockNews.map((news, index) => (
            <li key={index}>
              <a href={news.url}>
                {/* <img src={news.image} alt="" /> */}
                <img
                  src={
                    "https://cloud.iexapis.com/v1/news/image/2exV4BYV0G9GKfbGmDgaVKfgaf5V58mdTVGsjhbvrAzX"
                  }
                  alt=""
                />
                <div className={styles.newsText}>
                  <div className={styles.newsHeader}>
                    <p className={styles.newsHeadline}>{news.headline}</p>
                    <p className={styles.newsDate}>
                      {epochTimeConverter(news.datetime)}
                    </p>
                  </div>
                  <p className={styles.newsSummary}>{news.summary}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StockDetail;
