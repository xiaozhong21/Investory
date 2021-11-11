import * as React from "react";

import useApi from "../auth/useApi";

import Portfolios from "./Portfolios";
import Watchlist from "./Watchlist";
import styles from "./styles.module.scss";

const MyStocks = () => {
  const { loading } = useApi();

  return loading ? null : (
    <section className={styles.myStocks}>
      <Portfolios />
      <Watchlist />
    </section>
  );
};

export default MyStocks;
