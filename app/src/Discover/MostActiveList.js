import { Link } from "react-router-dom";

import styles from "./styles.module.scss";

const MostActiveList = ({ mostActive, updateWatchListButton }) => (
  <table>
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Company Name</th>
        <th>Daily Change</th>
        <th>Latest Price</th>
        <th>Watchlist Status</th>
      </tr>
    </thead>
    <tbody>
      {mostActive &&
        mostActive.map((stock) => (
          <tr key={stock.symbol}>
            <td className={styles.leftAlign}>
              <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link>
            </td>
            <td className={styles.leftAlign}>
              <Link to={`/stocks/${stock.symbol}`}>{stock.companyName}</Link>
            </td>
            <td>
              <Link
                to={`/stocks/${stock.symbol}`}
                className={
                  stock.changePercent > 0 ? styles.positive : styles.negative
                }
              >
                {stock.changePercent > 0 ? "+" : null}
                {stock.changePercent
                  ? stock.changePercent.toFixed(2) + "%"
                  : "N/A"}
              </Link>
            </td>
            <td>
              <Link to={`/stocks/${stock.symbol}`}>
                ${stock.latestPrice?.toFixed(2)}
              </Link>
            </td>
            <td>{updateWatchListButton(stock)}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

export default MostActiveList;
