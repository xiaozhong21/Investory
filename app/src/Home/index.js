import stockChart from "./stockChart.png";
import styles from "./styles.module.scss";

const Home = () => {
  return (
    <section className={styles.home}>
      <h1>Know Your Invest Story with InveStory</h1>
      <p>Compare Portfolio Strategies, Under Risk and Return</p>
      <img src={stockChart} alt="" />
    </section>
  );
};

export default Home;
