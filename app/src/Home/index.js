import discoverIdeas from "./discoverIdeas.png";
import moneyTree from "./moneyTree.png";
import stockChart from "./stockChart.png";
import styles from "./styles.module.scss";

const Home = () => {
  return (
    <section className={styles.home}>
      <h1>
        Own Your Investment Story with <span>Investory</span>
      </h1>
      <p>Test Portfolio Strategies, Visualize Risk and Return</p>
      <div className={styles.mainSection}>
        <img src={discoverIdeas} alt="" />
        <div className={styles.description}>
          <h2>Discover</h2>
          <p>Get investment inspiration from daily gainers and top movers.</p>
        </div>
      </div>
      <div className={styles.mainSection}>
        <img src={stockChart} alt="" />
        <div className={styles.description}>
          <h2>Backtest a Portfolio</h2>
          <p>
            Create your hypothetical portoflio of stocks to see how it has
            performed in the time frame you specified.
          </p>
        </div>
      </div>
      <div className={styles.mainSection}>
        <img src={moneyTree} alt="" />
        <div className={styles.description}>
          <h2>My Stocks</h2>
          <p>
            This is the center hub where you can track your portoflios and
            watchlist.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;
