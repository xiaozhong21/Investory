import * as React from "react";

import "./styles.module.scss";
import useApi from "../auth/useApi";
import useAuth0 from "../auth/useAuth0";

const AddPortfolio = () => {
  const { apiClient } = useApi();
  const { user } = useAuth0();
  const [values, setValues] = React.useState({
    allocation1: "",
    allocation2: "",
    allocation3: "",
  });
  const [total, setTotal] = React.useState(0);

  const handleAddValues = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    console.log(value);
    const newValues = {
      ...values,
      [name]: value,
    };
    setValues(newValues);
    sumTotal(newValues);
  };

  const sumTotal = (newValues) => {
    const { allocation1, allocation2, allocation3 } = newValues;
    const newTotal =
      Number(allocation1) + Number(allocation2) + Number(allocation3);
    setTotal(newTotal);
  };

  const onSubmit = async (event) => {
    const form = event.currentTarget;
    const portfolio = Object.fromEntries(new FormData(form).entries());
    event.preventDefault();
    // await apiClient.addUserPortfolio(portfolio);
    console.log(portfolio);
    console.log(user.sub);
  };

  return (
    <form {...{ onSubmit }}>
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
        <label htmlFor="firstMonth">First Month</label>
        <select id="firstMonth" name="firstMonth" defaultValue="01">
          <option value="01">Jan</option>
          <option value="02">Feb</option>
          <option value="03">Mar</option>
          <option value="04">Apr</option>
          <option value="05">May</option>
          <option value="06">Jun</option>
          <option value="07">Jul</option>
          <option value="08">Aug</option>
          <option value="09">Sep</option>
          <option value="10">Oct</option>
          <option value="11">Nov</option>
          <option value="12">Dec</option>
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
        <label htmlFor="lastMonth">Last Month</label>
        <select id="lastMonth" name="lastMonth" defaultValue="12">
          <option value="01">Jan</option>
          <option value="02">Feb</option>
          <option value="03">Mar</option>
          <option value="04">Apr</option>
          <option value="05">May</option>
          <option value="06">Jun</option>
          <option value="07">Jul</option>
          <option value="08">Aug</option>
          <option value="09">Sep</option>
          <option value="10">Oct</option>
          <option value="11">Nov</option>
          <option value="12">Dec</option>
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
        <input
          type="number"
          id="allocation1"
          name="allocation1"
          defaultValue="0"
          onChange={handleAddValues}
        />
        <span>%</span>
      </div>
      <div>
        <label htmlFor="symbol2">Asset 2</label>
        <input id="symbol2" name="symbol2" placeholder="Ticker symbol" />
        <input
          type="number"
          id="allocation2"
          name="allocation2"
          defaultValue="0"
          onChange={handleAddValues}
        />
        <span>%</span>
      </div>
      <div>
        <label htmlFor="symbol3">Asset 3</label>
        <input id="symbol3" name="symbol3" placeholder="Ticker symbol" />
        <input
          type="number"
          id="allocation3"
          name="allocation3"
          defaultValue="0"
          onChange={handleAddValues}
        />
        <span>%</span>
      </div>
      <div>
        <b>Total</b>
        <input name="invisible" disabled="disabled" />
        <input type="number" name="total" value={total} readOnly />
        <span>%</span>
      </div>
      <button>Analyze Portfolio</button>
    </form>
  );
};

export default AddPortfolio;
