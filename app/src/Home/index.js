import { Link } from "react-router-dom";

import discoverIdeas from "../images/discoverIdeas.png";
import moneyTree from "../images/moneyTree.png";
import stockChart from "../images/stockChart.png";

import styles from "./styles.module.scss";

const Home = () => {
  return (
    <section className={styles.home} data-testid="home">
      <div className={styles.slogan}>
        <h1>
          Own Your Investment Story with{" "}
          <span className={styles.yellow}>
            Inve<span className={styles.green}>$</span>tory
          </span>
          .
        </h1>
        <p>
          Backtest Portfolio Strategies, Visualize Risk and Return, and more...
        </p>
      </div>
      <div className={`${styles.mainSection} ${styles.discover}`}>
        <img src={discoverIdeas} alt="" />
        <div className={styles.description}>
          <h2>Discover</h2>
          <p>Get investment inspirations from daily gainers and top movers.</p>
          <Link to="/discover">
            <button>Discover Stocks</button>
          </Link>
        </div>
      </div>
      <div className={`${styles.mainSection} ${styles.backtest}`}>
        <div className={styles.description}>
          <h2>Backtest Portfolio</h2>
          <p>
            Create your investment story by building your customized portfolio
            of stocks and visualize how it has performed in the time frame you
            specified.
          </p>
          <Link to="/addPortfolio">
            <button>Create Portfolio</button>
          </Link>
        </div>
        <img src={stockChart} alt="" />
      </div>
      <div className={`${styles.mainSection} ${styles.myStocks}`}>
        <img src={moneyTree} alt="" />
        <div className={styles.description}>
          <h2>My Stocks</h2>
          <p>
            This is the center hub where you can track your portfolios and
            watchlist.
          </p>
          <Link to="/mystocks">
            <button>Start Tracking</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
