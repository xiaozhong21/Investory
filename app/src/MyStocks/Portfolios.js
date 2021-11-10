import * as React from "react";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import VariablePie from "highcharts/modules/variable-pie.js";
import { Link } from "react-router-dom";

import useApi from "../auth/useApi";
import diamond from "../images/diamond.svg";
import edit from "../images/edit.svg";
import infoCircle from "../images/infoCircle.svg";
import lineChartUp from "../images/lineChartUp.svg";
import trashCan from "../images/trashCan.svg";
import { convertHoldingPeriod, convertNumToThousandths } from "../utils.js";

import styles from "./styles.module.scss";

VariablePie(Highcharts);

const Portfolios = () => {
  const { loading, apiClient } = useApi();
  const [portfolios, setPortfolios] = React.useState([]);

  const loadPortfolios = React.useCallback(
    async () => setPortfolios(await apiClient.getPortfolios()),
    [apiClient],
  );

  const handleDeletePortfolio = async (portfolio_id) => {
    await apiClient.deletePortfolio(portfolio_id);
    loadPortfolios();
  };

  React.useEffect(() => {
    if (!loading) {
      loadPortfolios();
    }
  }, [loading, loadPortfolios]);

  return !portfolios.length ? (
    <section className={styles.addStockReminder}>
      <h2>
        <img src={infoCircle} alt="information icon" />
        You have not added any portfolio yet
      </h2>
      <h3>
        <Link to={`/addPortfolio`}>Create portfolio</Link> to start backtesting
      </h3>
    </section>
  ) : (
    <section className={styles.portfolios}>
      <h2 className={styles.header}>
        <img src={diamond} alt="diamond icon" />
        <span>Portfolios</span>
      </h2>
      <div className={styles.portfolioCard}>
        {portfolios.map(
          ({ portfolio_id, portfolio_name, time_period, initial_amount }) => (
            <li key={portfolio_id}>
              <div className={styles.portfolioComposition}>
                <PortfolioStocks
                  {...{
                    portfolio_id,
                    portfolio_name,
                    time_period,
                    initial_amount,
                  }}
                />
              </div>
              <div className={styles.portfolioIcons}>
                <Link to={`/portfolios/${portfolio_id}`}>
                  <button type="button" title="portfolio performance">
                    <img src={lineChartUp} alt="uptrend line chart icon" />
                  </button>
                </Link>
                <Link to={`/editPortfolio/${portfolio_id}`}>
                  <button type="button" title="edit portfolio">
                    <img src={edit} alt="pencil icon" />
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeletePortfolio(portfolio_id)}
                  title="delete portfolio"
                >
                  <img src={trashCan} alt="trash can icon" />
                </button>
              </div>
            </li>
          ),
        )}
      </div>
    </section>
  );
};

const PortfolioStocks = ({
  portfolio_id,
  portfolio_name,
  time_period,
  initial_amount,
}) => {
  const { loading, apiClient } = useApi();
  const [portfolioStocks, setPortfolioStocks] = React.useState([]);

  const loadPortfolioStocks = React.useCallback(
    async () =>
      setPortfolioStocks(await apiClient.getPortfolioStocks(portfolio_id)),
    [apiClient, portfolio_id],
  );

  const formattedData = portfolioStocks.map((stock) => ({
    name: stock.ticker,
    y: Number(stock.allocation),
  }));

  const options = {
    chart: {
      type: "variablepie",
      backgroundColor: "transparent",
      style: {
        maxWidth: "100%",
        margin: "auto",
        padding: "3% 0 7% 0",
      },
    },
    colors: [
      "#BC8CF2",
      "#24CBE5",
      "#E9A6A6",
      "#64E572",
      "#FF9655",
      "#FFF263",
      "#007ED6",
      "#158FAD",
      "#B8255F",
      "#CCAC93",
    ],
    plotOptions: {
      variablepie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    title: {
      text: portfolio_name ? portfolio_name : "Portfolio " + portfolio_id,
      style: {
        color: "#703de1",
        fontSize: "20px",
      },
    },
    subtitle: {
      text:
        "Holding Period: " +
        convertHoldingPeriod(time_period) +
        "<br>Initial Amount: $" +
        convertNumToThousandths(initial_amount),
      style: {
        fontSize: "15px",
      },
    },
    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        "Allocation: <b>{point.y}%",
    },
    series: [
      {
        innerSize: "30%",
        data: formattedData,
      },
    ],
  };

  React.useEffect(() => {
    if (!loading) {
      loadPortfolioStocks();
    }
  }, [loading, loadPortfolioStocks]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { padding: 0 } }}
    />
  );
};

export default Portfolios;
