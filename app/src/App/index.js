import * as React from "react";

import { Routes, Route } from "react-router-dom";

import AddPortfolio from "../AddPortfolio";
import Discover from "../Discover";
import Home from "../Home";
import MyStocks from "../MyStocks";
import Portfolios from "../MyStocks/Portfolios";
import PortfolioDetail from "../PortfolioDetail";
import StockDetail from "../StockDetail";
import useApi from "../auth/useApi";
import useAuth0 from "../auth/useAuth0";
import { Protected } from "../auth/widgets";
import Footer from "../widgets/Footer";
import Nav from "../widgets/Nav/index";

import styles from "./styles.module.scss";

const App = () => {
  const { isAuthenticated, user } = useAuth0();
  const { loading, apiClient } = useApi();

  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      apiClient.addOrUpdateUser(user);
    }
  }, [isAuthenticated, user, loading, apiClient]);

  return (
    <div className={styles.app}>
      <header>
        <Nav />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/discover"
            element={<Protected component={Discover} />}
          />
          <Route
            path="/mystocks"
            element={<Protected component={MyStocks} />}
          />
          <Route
            path="/stocks/:ticker"
            element={<Protected component={StockDetail} />}
          />
          <Route
            path="/portfolios"
            element={<Protected component={Portfolios} />}
          />
          <Route
            path="/portfolios/:portfolio_id"
            element={<Protected component={PortfolioDetail} />}
          />
          <Route
            path="/addPortfolio"
            element={<Protected component={AddPortfolio} />}
          />
          <Route
            path="/editPortfolio/:portfolio_id"
            element={<Protected component={AddPortfolio} />}
          />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;
