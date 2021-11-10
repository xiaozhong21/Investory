import * as React from "react";

import { useParams, Link } from "react-router-dom";

import useApi from "../auth/useApi";
import { sortedArrayByAllocation } from "../utils.js";

import PortfolioChart from "./PortfolioChart";
import styles from "./styles.module.scss";

const PortfolioDetail = () => {
  const { loading, apiClient } = useApi();
  const [portfolio, setPortfolio] = React.useState();
  const [portfolioStocks, setPortfolioStocks] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const { portfolio_id } = useParams();

  const loadPortfolio = React.useCallback(
    () =>
      apiClient
        .getPortfolio(portfolio_id)
        .then((response) => {
          setPortfolio(response);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [apiClient, portfolio_id],
  );

  const loadPortfolioStocks = React.useCallback(
    () =>
      apiClient
        .getPortfolioStocks(portfolio_id)
        .then((response) => {
          setPortfolioStocks(response);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [apiClient, portfolio_id],
  );

  React.useEffect(() => {
    portfolio_id !== undefined && !loading && loadPortfolio();
  }, [loading, portfolio_id, loadPortfolio]);

  React.useEffect(() => {
    portfolio_id !== undefined && !loading && loadPortfolioStocks();
  }, [loading, portfolio_id, loadPortfolioStocks]);

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !portfolio || !portfolioStocks ? (
    <p>Loading...</p>
  ) : (
    <div className={styles.portfolioDetail}>
      <h2>
        Your Inve<span className={styles.green}>$</span>tory for{" "}
        <span className={styles.purple}>
          {portfolio.portfolio_name
            ? portfolio.portfolio_name
            : `portfolio ${portfolio_id}`}
        </span>
      </h2>
      <div>
        <h3 className={styles.purple}>Portfolio Composition</h3>
        <ul>
          {sortedArrayByAllocation(portfolioStocks).map((stock) => (
            <li key={stock.ticker} className={styles.normalFontWeight}>
              <Link to={`/stocks/${stock.ticker}`}>{stock.ticker}</Link>:{" "}
              {stock.allocation}%
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className={styles.purple}>Portfolio Statistics</h3>
        <PortfolioChart {...{ portfolio, portfolioStocks }} />
      </div>
    </div>
  );
};

export default PortfolioDetail;
