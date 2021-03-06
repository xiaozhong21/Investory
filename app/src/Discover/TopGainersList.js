import { Link } from "react-router-dom";

import { useMyWatchlist } from "../myWatchlist.js";

import styles from "./styles.module.scss";

const TopGainersList = ({ topGainers }) => {
  const { updateWatchListButton } = useMyWatchlist();

  return (
    <ul className={styles.gainers}>
      {topGainers &&
        topGainers.map((stock) => (
          <li key={stock.symbol}>
            <Link to={`/stocks/${stock.symbol}`}>
              <button className={styles.symbol}>{stock.symbol}</button>
              <span className={styles.changePercent}>
                +{stock.changePercent?.toFixed(2) + "%"}
              </span>
              <span>${stock.latestPrice?.toFixed(2)}</span>
            </Link>
            {updateWatchListButton(stock)}
          </li>
        ))}
    </ul>
  );
};

export default TopGainersList;
