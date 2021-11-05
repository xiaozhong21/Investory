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
