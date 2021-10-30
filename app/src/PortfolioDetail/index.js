import * as React from "react";

import { useParams, Link } from "react-router-dom";

import useApi from "../auth/useApi";

const PortfolioDetail = () => {
  const { loading, apiClient } = useApi();
  const [portfolioStocks, setPortfolioStocks] = React.useState();
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const { portfolio_id } = useParams();

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
    portfolio_id !== undefined && !loading && loadPortfolioStocks();
  }, [loading, portfolio_id, loadPortfolioStocks]);

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !portfolioStocks ? (
    <p>Loading...</p>
  ) : (
    <>
      <p>This is portfolio detail page for portfolio {portfolio_id}</p>
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

export default PortfolioDetail;
