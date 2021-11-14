import * as React from "react";

import useApi from "../auth/useApi";
import emptyHeart from "../images/emptyHeart.svg";
import filledHeart from "../images/filledHeart.svg";
import flame from "../images/flame.svg";
import trendingUp from "../images/trendingUp.svg";
import { timestampFormatter } from "../utils";

import MostActiveList from "./MostActiveList";
import TopGainersList from "./TopGainersList";
import styles from "./styles.module.scss";

const Discover = () => {
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
      <div className={styles.instructions}>
        <p>
          Get investment inspirations from our live updated top gainers and most
          active stocks. Last updated at {timestampFormatter(new Date())}.
        </p>
        <p>
          Click on <img src={emptyHeart} alt="empty heart icon" /> to add to
          watchlist, <img src={filledHeart} alt="filled heart icon" /> to remove
          from watchlist.
        </p>
        <p>Click on individual stock to view stock details.</p>
      </div>
      <div>
        <h2 className={styles.header}>
          <img src={trendingUp} alt="uptrend icon" />
          <span>Top Gainers</span>
        </h2>
        <TopGainersList {...{ topGainers }} />
      </div>
      <div>
        <h2 className={styles.header}>
          <img src={flame} alt="flame icon" />
          <span>Most Active</span>
        </h2>
        <MostActiveList {...{ mostActive }} />
      </div>
    </section>
  );
};

export default Discover;
