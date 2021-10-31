import * as React from "react";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import useApi from "../auth/useApi";

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
    [apiClient, time_period, portfolioStockTickers, portfolioStockAllocations],
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
          text: "Return",
        },
      },
    ],
    series: [
      {
        data: chartData.returnAndLabels,
      },
    ],
  };

  React.useEffect(() => {
    !loading && portfolioStockTickers && loadChartData();
  }, [loading, portfolioStockTickers, loadChartData]);

  React.useEffect(
    () => setEndingPortfolioValue(initial_amount * (1 + portfolioReturn / 100)),
    [portfolioReturn, initial_amount],
  );

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !chartData ? (
    <p>Loading...</p>
  ) : (
    <div>
      <p>Holding period return: {portfolioReturn}%</p>
      <p>Initial portfolio value: {initial_amount}</p>
      <p>Ending portfolio value: ${endingPortfolioValue}</p>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
};

export default PortfolioChart;
