import * as React from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import useApi from "../auth/useApi";

import "./styles.module.scss";

const AddPortfolio = () => {
  const { loading, apiClient } = useApi();
  const { portfolio_id } = useParams();
  const navigate = useNavigate();
  let isAddMode = !portfolio_id;
  const [portfolio, setPortfolio] = React.useState();
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [autopopulate, setAutopopulate] = React.useState(true);

  const loadPortfolio = React.useCallback(
    () =>
      apiClient
        .getPortfolio(portfolio_id)
        .then((response) => {
          setPortfolio(response);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        }),
    [apiClient, portfolio_id],
  );

  const { register, control, handleSubmit, reset, setValue, formState, watch } =
    useForm();
  const { errors } = formState;
  const { fields, append, remove, update } = useFieldArray({
    name: "assets",
    control,
  });
  const numberOfAssets = watch("numberOfAssets");

  React.useEffect(() => {
    portfolio_id !== undefined && !loading && loadPortfolio();
  }, [loading, portfolio_id, loadPortfolio]);

  React.useEffect(() => {
    if (!isAddMode) {
      if (portfolio && autopopulate) {
        setValue("timePeriod", portfolio.time_period);
        setValue("initialAmount", portfolio.initial_amount);
        setValue("portfolioName", portfolio.portfolio_name);
        setAutopopulate(false);
      }
    }
    const watchFields = [];
    for (let i = 0; i < numberOfAssets; i++) {
      watchFields.push(watch(`assets[${i}]ticker`));
    }
    const newVal = parseInt(numberOfAssets || 0);
    const oldVal = fields.length;
    if (newVal > oldVal) {
      // update({
      //   timePeriod: watchFields2[0],
      //   initialAmount: watchFields2[1],
      //   portfolioName: watchFields2[2],
      // });
      for (let i = 0; i < oldVal; i++) {
        update(i, {
          ticker: watchFields[i],
          allocation:
            100 % newVal === 0 ? 100 / newVal : (100 / newVal).toFixed(2),
        });
      }
      for (let i = oldVal; i < newVal; i++) {
        append({
          ticker: "",
          allocation:
            100 % newVal === 0
              ? 100 / newVal
              : i === newVal - 1
              ? (100 - (100 / newVal).toFixed(2) * (newVal - 1)).toFixed(2)
              : (100 / newVal).toFixed(2),
        });
      }
    } else {
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
      for (let i = 0; i < newVal; i++) {
        update(i, {
          ticker: watchFields[i],
          allocation:
            100 % newVal === 0
              ? 100 / newVal
              : i === newVal - 1
              ? (100 - (100 / newVal).toFixed(2) * (newVal - 1)).toFixed(2)
              : (100 / newVal).toFixed(2),
        });
      }
    }
  }, [
    append,
    fields.length,
    numberOfAssets,
    remove,
    update,
    watch,
    isAddMode,
    portfolio,
    setValue,
    autopopulate,
  ]);

  const onSubmit = async (data) => {
    if (isAddMode) {
      // await apiClient.updateStockQuotes(data.assets);
      const portfolio = await apiClient.addUserPortfolio(data);
      apiClient.addPortfolioStocks(portfolio.portfolio_id, data.assets);
      navigate("/mystocks");
    } else {
      console.log(data);
      // const updatedPortfolio = await apiClient.updateUserPortfolio(
      //   portfolio_id,
      //   data,
      // );
      // console.log(updatedPortfolio);
      // apiClient.updatePortfolioStocks(portfolio.portfolio_id, data.assets);
      // navigate("/mystocks");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card m-3">
        <h5 className="card-header">
          Create Your Portfolio to Start Backtesting
        </h5>
        <div className="card-body border-bottom">
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="timePeriod">
                Historical Time Period<span>*</span>
              </label>
              <select
                id="timePeriod"
                name="timePeriod"
                {...register("timePeriod")}
                defaultValue="ytd"
                className="form-control"
                required
              >
                <option value="3m">3-Month</option>
                <option value="6m">6-Month</option>
                <option value="ytd">Year-to-Date</option>
                <option value="1y">1-Year</option>
                <option value="2y">2-Year</option>
                <option value="5y">5-Year</option>
              </select>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="initialAmount">
                Initial Amount($)<span>*</span>
              </label>
              <input
                type="number"
                id="initialAmount"
                name="initialAmount"
                {...register("initialAmount")}
                defaultValue="10000"
                placeholder="Amount..."
                className="form-control"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="portfolioName">Portfolio Name</label>
              <input
                type="text"
                id="portfolioName"
                name="portfolioName"
                {...register("portfolioName")}
                className="form-control"
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="numberOfAssets">
                Number of Assets<span>*</span>
              </label>
              <select
                name="numberOfAssets"
                {...register("numberOfAssets")}
                className={`form-control ${
                  errors.numberOfAssets ? "is-invalid" : ""
                }`}
                required
              >
                {["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
              <div className="invalid-feedback">
                {errors.numberOfAssets?.message}
              </div>
            </div>
          </div>
        </div>
        {numberOfAssets ? (
          <h6 className="card-header">Portfolio Assets</h6>
        ) : null}
        <div key={fields}>
          {fields.map((item, i) => (
            <div key={i} className="list-group list-group-flush">
              <div className="list-group-item">
                <h5 className="card-title">Asset {i + 1}</h5>
                <div className="form-row">
                  <div className="form-group col-6">
                    <label htmlFor={`assets[${i}]ticker`}>
                      Ticker<span>*</span>
                    </label>
                    <input
                      id={`assets[${i}]ticker`}
                      name={`assets[${i}]ticker`}
                      {...register(`assets.${i}.ticker`)}
                      type="text"
                      className={`form-control ${
                        errors.assets?.[i]?.ticker ? "is-invalid" : ""
                      }`}
                      required
                    />
                    <div className="invalid-feedback">
                      {errors.assets?.[i]?.ticker?.message}
                    </div>
                  </div>
                  <div className="form-group col-6">
                    <label htmlFor={`assets[${i}]allocation`}>
                      Allocation (%)<span>*</span>
                    </label>
                    <input
                      id={`assets[${i}]allocation`}
                      name={`assets[${i}]allocation`}
                      {...register(`assets.${i}.allocation`)}
                      type="number"
                      step="any"
                      className={`form-control ${
                        errors.assets?.[i]?.allocation ? "is-invalid" : ""
                      }`}
                      min="1"
                      max="100"
                      required
                    />
                    <div className="invalid-feedback">
                      {errors.assets?.[i]?.allocation?.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card-footer text-center border-top-0">
          <button type="submit" className="btn btn-primary mr-1">
            Analyze Portfolio
          </button>
          <button
            onClick={() => reset()}
            type="button"
            className="btn btn-secondary mr-1"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );

  return isAddMode ? (
    formContent
  ) : error === true ? (
    <p>{errorMessage}</p>
  ) : !portfolio ? (
    <p>Loading...</p>
  ) : (
    formContent
  );
};

export default AddPortfolio;
