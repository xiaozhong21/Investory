import * as React from "react";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import useApi from "../auth/useApi";

import styles from "./styles.module.scss";

require("highcharts/modules/exporting")(Highcharts);

const PortfolioChart = ({ portfolio, portfolioStocks }) => {
  const { loading, apiClient } = useApi();
  const { portfolio_id, portfolio_name, time_period, initial_amount } =
    portfolio;
  const [chartData, setChartData] = React.useState({});
  const [portfolioReturn, setPortfolioReturn] = React.useState(0);
  const [endingPortfolioValue, setEndingPortfolioValue] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const portfolioStockTickers = portfolioStocks
    .map((stock) => stock.ticker)
    .join(",");
  const portfolioStockAllocations = portfolioStocks
    .map((stock) => stock.allocation)
    .join(",");

  const loadChartData = React.useCallback(
    () =>
      apiClient
        .getChartData(
          time_period,
          portfolioStockTickers,
          portfolioStockAllocations,
          initial_amount,
        )
        .then((response) => {
          setChartData(response);
          setPortfolioReturn(
            response.portfolioReturns[response.portfolioReturns.length - 1],
          );
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [
      apiClient,
      time_period,
      portfolioStockTickers,
      portfolioStockAllocations,
      initial_amount,
    ],
  );

  const options = {
    title: {
      text: `Historical Performance for ${
        portfolio_name ? portfolio_name : `portfolio ${portfolio_id}`
      }`,
    },
    yAxis: [
      {
        title: {
          text: "Portfolio Value ($)",
        },
      },
    ],
    series: [
      {
        data: chartData.valueAndLabels,
      },
    ],
  };

  React.useEffect(() => {
    !loading && portfolioStockTickers && loadChartData();
  }, [loading, portfolioStockTickers, loadChartData]);

  React.useEffect(
    () =>
      setEndingPortfolioValue(
        Number(initial_amount * (1 + portfolioReturn / 100)).toFixed(0),
      ),
    [portfolioReturn, initial_amount],
  );

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !chartData ? (
    <p>Loading...</p>
  ) : (
    <div>
      <table>
        <thead>
          <tr>
            <th>Holding Period</th>
            <th>Holding Period Return</th>
            <th>Initial Portfolio Value</th>
            <th>Ending Portfolio Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{time_period}</td>
            <td>{portfolioReturn}%</td>
            <td>${initial_amount}</td>
            <td>${endingPortfolioValue}</td>
          </tr>
        </tbody>
      </table>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
};

export default PortfolioChart;
