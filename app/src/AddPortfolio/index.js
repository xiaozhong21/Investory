import * as React from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useFieldArray } from "react-hook-form";
import * as Yup from "yup";

// import "./styles.module.scss";
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

  const validationSchema = Yup.object().shape({
    numberOfAssets: Yup.string().required("Number of assets is required"),
    assets: Yup.array().of(
      Yup.object().shape({
        symbol: Yup.string().required("Symbol is required"),
        allocation: Yup.number()
          .min(1)
          .max(100)
          .required("Allocation is required"),
      }),
    ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, control, handleSubmit, reset, formState, watch } =
    useForm(formOptions);
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({ name: "assets", control });

  const numberOfAssets = watch("numberOfAssets");

  React.useEffect(() => {
    const newVal = parseInt(numberOfAssets || 0);
    const oldVal = fields.length;
    if (newVal > oldVal) {
      for (let i = oldVal; i < newVal; i++) {
        append({ symbol: "", allocation: "" });
      }
    } else {
      for (let i = oldVal; i > newVal; i--) {
        remove(i - 1);
      }
    }
  }, [append, fields.length, numberOfAssets, remove]);

  function onSubmit(data) {
    console.log(data);
    alert("SUCCESS!! :-)\n\n" + JSON.stringify(data, null, 4));
  }

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

  // const onSubmit = async (event) => {
  //   const form = event.currentTarget;
  //   const portfolio = Object.fromEntries(new FormData(form).entries());
  //   event.preventDefault();
  //   // await apiClient.addUserPortfolio(portfolio);
  //   console.log(portfolio);
  //   console.log(user.sub);
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="card m-3">
        <h5 className="card-header">Create Portfolio</h5>
        <div className="card-body border-bottom">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startYearMonth">Start Year and Month</label>
              <input
                type="month"
                id="startYearMonth"
                name="startYearMonth"
                min="2007-01"
                max="2021-10"
                defaultValue="2007-01"
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endYearMonth">End Year and Month</label>
              <input
                type="month"
                id="endYearMonth"
                name="endYearMonth"
                min="2007-01"
                max="2021-10"
                defaultValue="2021-10"
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="initialAmount">Initial Amount</label>
              <span>$</span>
              <input
                type="number"
                id="initialAmount"
                name="initialAmount"
                defaultValue="10000"
                placeholder="Amount..."
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="portfolioName">Portfolio Name</label>
              <input
                type="text"
                id="portfolioName"
                name="portfolioName"
                className="form-control"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numberOfAssets">Number of Assets</label>
              <select
                name="numberOfAssets"
                {...register("numberOfAssets")}
                className={`form-control ${
                  errors.numberOfAssets ? "is-invalid" : ""
                }`}
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
        <div>
          <b>Portfolio Assets</b>
        </div>
        {fields.map((item, i) => (
          <div key={i} className="list-group list-group-flush">
            <div className="list-group-item">
              <h5 className="card-title">Asset {i + 1}</h5>
              <div className="form-row">
                <div className="form-group col-6">
                  <label htmlFor={`assets[${i}]symbol`}>Symbol</label>
                  <input
                    id={`assets[${i}]symbol`}
                    name={`assets[${i}]symbol`}
                    {...register(`assets.${i}.symbol`)}
                    type="text"
                    className={`form-control ${
                      errors.assets?.[i]?.symbol ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.assets?.[i]?.symbol?.message}
                  </div>
                </div>
                <div className="form-group col-6">
                  <label htmlFor={`assets[${i}]allocation`}>Allocation</label>
                  <input
                    id={`assets[${i}]allocation`}
                    name={`assets[${i}]allocation`}
                    {...register(`assets.${i}.allocation`)}
                    type="number"
                    className={`form-control ${
                      errors.assets?.[i]?.allocation ? "is-invalid" : ""
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors.assets?.[i]?.allocation?.message}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* <div>
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
        </div> */}
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
};

export default AddPortfolio;
