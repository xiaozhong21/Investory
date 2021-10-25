import "./styles.module.scss";

const AddPortfolio = () => {
  const onSubmit = async (event) => {
    const form = event.currentTarget;
    const portfolio = Object.fromEntries(new FormData(form).entries());
    event.preventDefault();
    console.log(portfolio);
  };

  return (
    <form {...{ onSubmit }}>
      <div>
        <label htmlFor="timePeriod">Time Period</label>
        <select id="timePeriod" name="timePeriod" defaultValue="Year">
          <option value="Month">Month-to-Month</option>
          <option value="Year">Year-to-Year</option>
        </select>
      </div>
      <div>
        <label htmlFor="startYear">Start Year</label>
        <select id="startYear" name="startYear" defaultValue="2007">
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>
      </div>
      <div>
        <label htmlFor="endYear">End Year</label>
        <select id="endYear" name="endYear" defaultValue="2021">
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
        </select>
      </div>
      <div>
        <label htmlFor="initialAmount">Initial Amount</label>
        <span>$</span>
        <input
          type="number"
          id="initialAmount"
          name="initialAmount"
          defaultValue="10000"
          placeholder="Amount..."
        />
      </div>
      <div>
        <label htmlFor="portfolioName">Portfolio Name</label>
        <input type="text" id="portfolioName" name="portfolioName" />
      </div>
      <div>
        <b>Portfolio Assets</b>
      </div>
      <div>
        <label htmlFor="symbol1">Asset 1</label>
        <input id="symbol1" name="symbol1" placeholder="Ticker symbol" />
        <input id="allocation1" name="allocation1" />
        <span>%</span>
      </div>
      <div>
        <label htmlFor="symbol2">Asset 2</label>
        <input id="symbol2" name="symbol2" placeholder="Ticker symbol" />
        <input id="allocation2" name="allocation2" />
        <span>%</span>
      </div>
      <div>
        <label htmlFor="symbol3">Asset 3</label>
        <input id="symbol3" name="symbol3" placeholder="Ticker symbol" />
        <input id="allocation3" name="allocation3" />
        <span>%</span>
      </div>
      <button>Create Portfolio</button>
    </form>
  );
};

export default AddPortfolio;
