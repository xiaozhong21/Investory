import * as React from "react";

import { Routes, Route } from "react-router-dom";

import Discover from "../Discover";
import Nav from "../Nav";
import Tasks from "../Tasks";
import Watchlist from "../Watchlist";
import useApi from "../auth/useApi";
import useAuth0 from "../auth/useAuth0";
import { Protected } from "../auth/widgets";

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
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/" element={<Protected component={Home} />} /> */}
          <Route
            path="/dashboard"
            element={<Protected component={Dashboard} />}
          />
          <Route
            path="/discover"
            element={<Protected component={Discover} />}
          />
          {/* <Route path="/discover" element={<Discover />} /> */}
          <Route
            path="/watchlist"
            element={<Protected component={Watchlist} />}
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
      {isAuthenticated ? <Tasks /> : null}
    </>
  );
};

const Dashboard = () => <h1>Dashboard</h1>;

export default App;
