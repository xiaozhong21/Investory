import * as React from "react";

import useApi from "../auth/useApi";

import Portfolios from "./Portfolios";
import Watchlist from "./Watchlist";
import styles from "./styles.module.scss";

const MyStocks = ({ watchlist, setWatchlist }) => {
  const { loading } = useApi();

  return loading ? null : (
    <secton className={styles.myStocks}>
      <Portfolios />
      <Watchlist {...{ watchlist, setWatchlist }} />
    </secton>
  );
};

export default MyStocks;
