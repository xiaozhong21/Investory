import * as React from "react";

import useApi from "../auth/useApi";
import flame from "../images/flame.svg";
import trendingUp from "../images/trendingUp.svg";
import { useMyWatchlist } from "../myWatchlist";

import MostActiveList from "./MostActiveList";
import TopGainersList from "./TopGainersList";
import styles from "./styles.module.scss";

const Discover = () => {
  const { updateWatchListButton } = useMyWatchlist();
  const [topGainers, setTopGainers] = React.useState([]);
  const [mostActive, setMostActive] = React.useState([]);
  const { loading, apiClient } = useApi();

  const loadTopGainers = React.useCallback(
    async () => setTopGainers(await apiClient.getTopGainers()),
    [apiClient],
  );

  const loadMostActive = React.useCallback(
    async () => setMostActive(await apiClient.getMostActive()),
    [apiClient],
  );

  React.useEffect(() => {
    !loading && loadTopGainers() && loadMostActive();
  }, [loading, loadTopGainers, loadMostActive]);

  return loading ? null : (
    <section className={styles.discover}>
      <div>
        <h2 className={styles.header}>
          <img src={trendingUp} alt="uptrend icon" />
          <span>Top Gainers</span>
        </h2>
        <TopGainersList {...{ topGainers, updateWatchListButton }} />
      </div>
      <div>
        <h2 className={styles.header}>
          <img src={flame} alt="flame icon" />
          <span>Most Active</span>
        </h2>
        <MostActiveList {...{ mostActive, updateWatchListButton }} />
      </div>
    </section>
  );
};

export default Discover;
