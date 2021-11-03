import * as React from "react";

import { Link } from "react-router-dom";

import useApi from "../auth/useApi";

import diamond from "./diamond.svg";
import styles from "./styles.module.scss";

const Portfolios = () => {
  const { loading, apiClient } = useApi();
  const [portfolios, setPortfolios] = React.useState([]);

  const loadPortfolios = React.useCallback(
    async () => setPortfolios(await apiClient.getPortfolios()),
    [apiClient],
  );

  const handleDeletePortfolio = async (portfolio_id) => {
    await apiClient.deletePortfolio(portfolio_id);
    loadPortfolios();
  };

  React.useEffect(() => {
    if (!loading) {
      loadPortfolios();
    }
  }, [loading, loadPortfolios]);

  return !portfolios.length ? (
    <section>
      <h2>You have not added any portfolio yet</h2>
    </section>
  ) : (
    <section>
      <h2 className={styles.header}>
        <img src={diamond} alt="diamond icon" />
        <span>Portfolios</span>
      </h2>
      {portfolios.map(
        ({ portfolio_id, portfolio_name, time_period, initial_amount }) => (
          <div key={portfolio_id}>
            <details>
              <summary>
                {portfolio_name ? portfolio_name : "Portfolio " + portfolio_id}
              </summary>
              <p>
                Historical time period:
                {time_period}
              </p>
              <p>Initial Amount: ${initial_amount}</p>
              <PortfolioStocks {...{ portfolio_id }} />
            </details>
            <button
              type="button"
              onClick={() => handleDeletePortfolio(portfolio_id)}
            >
              Delete Portfolio
            </button>
            <Link to={`/editPortfolio/${portfolio_id}`}>
              <button type="button">Edit Portfolio</button>
            </Link>
            <Link to={`/portfolios/${portfolio_id}`}>
              <button type="button">Portfolio Historical Performance</button>
            </Link>
          </div>
        ),
      )}
    </section>
  );
};

const PortfolioStocks = ({ portfolio_id }) => {
  const { loading, apiClient } = useApi();
  const [portfolioStocks, setPortfolioStocks] = React.useState([]);

  const loadPortfolioStocks = React.useCallback(
    async () =>
      setPortfolioStocks(await apiClient.getPortfolioStocks(portfolio_id)),
    [apiClient, portfolio_id],
  );

  React.useEffect(() => {
    if (!loading) {
      loadPortfolioStocks();
    }
  }, [loading, loadPortfolioStocks]);

  return (
    <>
      <p>Holdings for portfolio {portfolio_id} </p>
      <ul>
        {portfolioStocks.map((stock) => (
          <li key={stock.ticker}>
            <Link to={`/stocks/${stock.ticker}`}>{stock.ticker} </Link> |{" "}
            {stock.allocation}%
          </li>
        ))}
      </ul>
    </>
  );
};

export default Portfolios;
