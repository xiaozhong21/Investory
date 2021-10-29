import * as React from "react";

import useApi from "../auth/useApi";

const Portfolios = () => {
  const { loading, apiClient } = useApi();
  const [portfolios, setPortfolios] = React.useState([]);

  const loadPortfolios = React.useCallback(
    async () => setPortfolios(await apiClient.getPortfolios()),
    [apiClient],
  );

  const handleDeletePortfolio = async (portfolio) => {
    await apiClient.deletePortfolio(portfolio.portfolio_id);
    loadPortfolios();
  };

  React.useEffect(() => {
    if (!loading) {
      loadPortfolios();
    }
  }, [loading, loadPortfolios]);

  return portfolios.length === 0 ? (
    <section>
      <h2>You have not added any portfolio yet</h2>
    </section>
  ) : (
    <section>
      <h2>Portfolios</h2>
      {portfolios.map((portfolio) => (
        <div key={portfolio.portfolio_id}>
          <details>
            <summary>Portfolio {portfolio.portfolio_id}</summary>
            <p>
              Historical time period:
              {portfolio.time_period}
            </p>
            <p>Initial Amount: ${portfolio.portfolio_values[0]}</p>
            <PortfolioStocks {...{ portfolio }} />
          </details>
          <button
            type="button"
            onClick={() => handleDeletePortfolio(portfolio)}
          >
            delete portfolio
          </button>
        </div>
      ))}
    </section>
  );
};

const PortfolioStocks = ({ portfolio }) => {
  const { loading, apiClient } = useApi();
  const [portfolioStocks, setPortfolioStocks] = React.useState([]);

  const loadPortfolioStocks = React.useCallback(
    async () =>
      setPortfolioStocks(
        await apiClient.getPortfolioStocks(portfolio.portfolio_id),
      ),
    [apiClient, portfolio.portfolio_id],
  );

  React.useEffect(() => {
    if (!loading) {
      loadPortfolioStocks();
    }
  }, [loading, loadPortfolioStocks]);

  return (
    <>
      <p>Holdings for portfolio {portfolio.portfolio_id} </p>
      <ul>
        {portfolioStocks.map((stock) => (
          <li key={stock.ticker}>
            {stock.ticker} | {stock.allocation}%
          </li>
        ))}
      </ul>
    </>
  );
};

export default Portfolios;
