import discoverIdeas from "../images/discoverIdeas.png";
import moneyTree from "../images/moneyTree.png";
import stockChart from "../images/stockChart.png";

import styles from "./styles.module.scss";

const Home = () => {
  return (
    <section className={styles.home}>
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
          <p>Get investment inspiration from daily gainers and top movers.</p>
          <button>Learn More</button>
        </div>
      </div>
      <div className={`${styles.mainSection} ${styles.backtest}`}>
        <img src={stockChart} alt="" />
        <div className={styles.description}>
          <h2>Backtest a Portfolio</h2>
          <p>
            Create your hypothetical portoflio of stocks to see how it has
            performed in the time frame you specified.
          </p>
          <button>Learn More</button>
        </div>
      </div>
      <div className={`${styles.mainSection} ${styles.myStocks}`}>
        <img src={moneyTree} alt="" />
        <div className={styles.description}>
          <h2>My Stocks</h2>
          <p>
            This is the center hub where you can track your portoflios and
            watchlist.
          </p>
          <button>Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default Home;
