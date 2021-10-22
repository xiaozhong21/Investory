import * as React from "react";

import useAuth0 from "./useAuth0";

const makeApi = (accessToken) => {
  const actions = {
    getTopGainers: () => _get("/api/topGainers"),
    getMostActive: () => _get("/api/mostActive"),
    getStockByTicker: (ticker) => _get(`/api/stocks/${ticker}`),
    getStockQuote: (ticker) => _get(`/api/stocks/quote/${ticker}`),
    // getBatchStockQuotes: (tickerList) =>
    //   _get(`/api/stocks/quotes/${tickerList}`),
    getWatchlist: () => _get("/api/watchlist"),
    updateStockQuotes: (stocks) => _post("/api/stocks/quotes", stocks),
    addOrUpdateStock: (stock) => _post("/api/stocks", stock),
    addStockToWatchlist: (stockID) => _post("/api/watchlist", { stockID }),
    addOrUpdateUser: (user) => _post("/api/users", { user }),
    deleteStockFromWatchlist: (stockID) => _delete(`/api/watchlist/${stockID}`),
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

  const _fetch = (url, options) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
