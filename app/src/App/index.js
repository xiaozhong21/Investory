import * as React from "react";

import { Routes, Route } from "react-router-dom";

import Discover from "../Discover";
import Nav from "../Nav";
import SearchBar from "../SearchBar";
import StockDetail from "../StockDetail";
import Watchlist from "../Watchlist";
import useApi from "../auth/useApi";
import useAuth0 from "../auth/useAuth0";
import { Protected } from "../auth/widgets";

import styles from "./styles.module.scss";

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const { loading, apiClient } = useApi();
  const [watchlist, setWatchlist] = React.useState([]);

  const loadWatchlist = React.useCallback(
    async () => setWatchlist(await apiClient.getWatchlist()),
    [apiClient],
  );

  const handleAddToWatchlist = async (stock) => {
    await apiClient.addOrUpdateStock(stock);
    const stockToBeAdded = await apiClient.getStockByTicker(stock.symbol);
    await apiClient.addStockToWatchlist(stockToBeAdded.id);
    loadWatchlist();
  };

  const handleDeleteFromWatchlist = async (stock) => {
    const stockToBeDeleted = await apiClient.getStockByTicker(stock.symbol);
    await apiClient.deleteStockFromWatchlist(stockToBeDeleted.id);
    loadWatchlist();
  };

  const updateWatchListButton = (stock) =>
    !watchlist.map((stock) => stock.ticker).includes(stock.symbol) ? (
      <button type="button" onClick={() => handleAddToWatchlist(stock)}>
        add to watchlist
      </button>
    ) : (
      <button type="button" onClick={() => handleDeleteFromWatchlist(stock)}>
        delete from watchlist
      </button>
    );

  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      apiClient.addOrUpdateUser(user);
    }
  }, [isAuthenticated, user, loading, apiClient]);

  React.useEffect(() => {
    !loading && loadWatchlist();
  }, [loading, loadWatchlist]);

  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/discover"
            element={
              <Protected component={Discover} {...{ updateWatchListButton }} />
            }
          />
          <Route
            path="/watchlist"
            element={<Protected component={Watchlist} />}
          />
          <Route
            path="/stocks/:ticker"
            element={
              <Protected
                component={StockDetail}
                {...{ updateWatchListButton }}
              />
            }
          />
        </Routes>
      </main>
    </>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <header className={styles.header}>
        <h1>{process.env.REACT_APP_TITLE}</h1>
        <p>{process.env.REACT_APP_SUBTITLE}</p>
      </header>
      {isAuthenticated ? "placeholder" : null}
    </>
  );
};

export default App;
