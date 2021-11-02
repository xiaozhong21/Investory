import * as React from "react";

import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import useApi from "../auth/useApi";

import "./styles.module.scss";

const AddPortfolio = () => {
  const { loading, apiClient } = useApi();
  const { portfolio_id } = useParams();
  const navigate = useNavigate();
  const isAddMode = !portfolio_id;
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
    const updatedAssetCount = parseInt(numberOfAssets || 0);
    const currentAssetCount = fields.length;
    const updatePrefilledAllocation = (i) => {
      if (100 % updatedAssetCount === 0) {
        return 100 / updatedAssetCount;
      } else {
        if (i === updatedAssetCount - 1) {
          return Number(
            (
              100 -
              (100 / updatedAssetCount).toFixed(2) * (updatedAssetCount - 1)
            ).toFixed(2),
          );
        } else {
          return Number((100 / updatedAssetCount).toFixed(2));
        }
      }
    };
    if (updatedAssetCount > currentAssetCount) {
      for (let i = 0; i < currentAssetCount; i++) {
        update(i, {
          ticker: watchFields[i],
          allocation: updatePrefilledAllocation(i),
        });
      }
      for (let i = currentAssetCount; i < updatedAssetCount; i++) {
        append({
          ticker: "",
          allocation: updatePrefilledAllocation(i),
        });
      }
    } else {
      for (let i = currentAssetCount; i > updatedAssetCount; i--) {
        remove(i - 1);
      }
      for (let i = 0; i < updatedAssetCount; i++) {
        update(i, {
          ticker: watchFields[i],
          allocation: updatePrefilledAllocation(i),
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
    const sumAllocations = data.assets.reduce(
      (acc, ele) => acc + Number(ele.allocation),
      0,
    );
    if (sumAllocations !== 100) {
      alert("Asset allocations must sum up to 100");
    } else if (isAddMode) {
      console.log(data.assets);
      const portfolio = await apiClient.addUserPortfolio(data);
      apiClient.addPortfolioStocks(portfolio.portfolio_id, data.assets);
      navigate("/mystocks");
    } else {
      await apiClient.updateUserPortfolio(portfolio_id, data);
      await apiClient.deletePortfolioStocks(portfolio_id);
      apiClient.addPortfolioStocks(portfolio_id, data.assets);
      navigate("/mystocks");
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card m-3">
        <h5 className="card-header">
          {isAddMode
            ? `Create Your Portfolio to Start Backtesting`
            : `Edit Your Portfolio`}
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
