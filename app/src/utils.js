export const convertHoldingPeriod = (timePeriod) => {
  switch (timePeriod) {
    case "3m":
      return "3-Month";
    case "6m":
      return "6-Month";
    case "ytd":
      return "Year-to-Date";
    case "1y":
      return "1-Year";
    case "2y":
      return "2-Year";
    case "5y":
      return "5-Year";
    default:
      return null;
  }
};

export const convertNumToThousandths = (num) => Number(num).toLocaleString();

export const sortedArrayByAllocation = (portfolioStocks) =>
  portfolioStocks.sort((a, b) => b.allocation - a.allocation);

export const getPortfolioReturn = (portfolioReturns) =>
  portfolioReturns[portfolioReturns.length - 1];

export const epochTimeConverter = (epochTime) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    monthNames[new Date(epochTime).getMonth()] +
    " " +
    new Date(epochTime).getDate()
  );
};

export const bigNumConverter = (num) => {
  const abbreviatedStr = ["", "K", "M", "B", "T"];
  const sNum = Math.floor(num.toString().length / 3);
  let sVal = parseFloat(
    (sNum !== 0 ? num / Math.pow(1000, sNum) : num).toPrecision(4),
  );
  if (sVal % 1 !== 0) {
    sVal = sVal.toFixed(2);
  }
  return sVal + abbreviatedStr[sNum];
};

export const timestampFormatter = (timestamp) => {
  return (
    timestamp.toString().substring(0, 24) +
    " " +
    timestamp.toString().substring(34)
  );
};
