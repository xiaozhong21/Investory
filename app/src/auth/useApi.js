import * as React from "react";

import useAuth0 from "./useAuth0";

const makeApi = (accessToken) => {
  const actions = {
    getTopGainers: () => _get("/api/market/topGainers"),
    getMostActive: () => _get("/api/market/mostActive"),
    getStockQuote: (ticker) => _get(`/api/market/stock/${ticker}/quote`),
    getWatchlist: () => _get("/api/watchlist"),
    getPortfolios: () => _get("/api/portfolios"),
    getPortfolioStocks: (portfolioID) =>
      _get(`api/portfolios/${portfolioID}/stocks`),
    updateStockQuotes: (stocks) => _post("/api/stocks/update-quotes", stocks),
    addStockToWatchlist: (ticker) => _post("/api/watchlist/stocks", { ticker }),
    addOrUpdateUser: (user) => _post("/api/users", { user }),
    addUserPortfolio: (portfolio) => _post("/api/portfolios", portfolio),
    addPortfolioStocks: (portfolioID, stocks) =>
      _post(`/api/portfolios/${portfolioID}/stocks`, stocks),
    deleteStockFromWatchlist: (ticker) =>
      _delete(`/api/watchlist/stocks/${ticker}`),
    deletePortfolio: (portfolioID) => _delete(`/api/portfolios/${portfolioID}`),
  };

  const _get = async (url) => (await _fetch(url)).json();

  const _post = async (url, body) => {
    const response = await _fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    let result;
    try {
      result = await response.json();
    } catch {}
    return result;
  };

  const _delete = (url) => _fetch(url, { method: "DELETE" });

  // const _fetch = (url, options) =>
  //   fetch(url, {
  //     ...options,
  //     headers: {
  //       ...(options?.headers ?? {}),
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });

  const _fetch = async (url, options) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  };

  return actions;
};

const useApi = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [state, setState] = React.useState({
    loading: true,
    error: null,
    apiClient: undefined,
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          setState({
            loading: false,
            error: null,
            apiClient: makeApi(accessToken),
          });
        } catch (error) {
          setState({ loading: false, error, apiClient: undefined });
        }
      })();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return state;
};

export default useApi;
