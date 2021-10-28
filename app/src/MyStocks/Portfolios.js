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
      <ul>
        {portfolios.map((portfolio) => (
          <li key={portfolio.portfolio_id}>
            Historical time period: {portfolio.time_period}
            <button
              type="button"
              onClick={() => handleDeletePortfolio(portfolio)}
            >
              delete portfolio
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Portfolios;
