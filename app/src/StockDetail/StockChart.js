import * as React from "react";

import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

import useApi from "../auth/useApi";

import styles from "./styles.module.scss";

require("highcharts/modules/exporting")(Highcharts);

const StockChart = ({ ticker }) => {
  const { loading, apiClient } = useApi();
  const [chartData, setChartData] = React.useState({});
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const loadChartData = React.useCallback(
    () =>
      apiClient
        .getChartData("5y", ticker, 100)
        .then((response) => {
          setChartData(response);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [apiClient, ticker],
  );

  const options = {
    title: {
      text: `Historical Performance for ${ticker}`,
    },
    yAxis: [
      {
        title: {
          text: "Price ($)",
        },
      },
    ],
    series: [
      {
        data: chartData.priceAndLabels,
      },
    ],
  };

  React.useEffect(() => {
    !loading && ticker && loadChartData();
  }, [loading, ticker, loadChartData]);

  return error === true ? (
    <p>{errorMessage}</p>
  ) : !chartData ? (
    <p>Loading...</p>
  ) : (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
        className={styles.stockChart}
      />
    </div>
  );
};

export default StockChart;
