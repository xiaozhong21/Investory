import * as React from "react";

import useApi from "../auth/useApi";

import Portfolios from "./Portfolios";
import Watchlist from "./Watchlist";

const MyStocks = ({ watchlist, setWatchlist }) => {
  const { loading } = useApi();

  return loading ? null : (
    <>
      <Portfolios />
      <Watchlist {...{ watchlist, setWatchlist }} />
    </>
  );
};

export default MyStocks;
