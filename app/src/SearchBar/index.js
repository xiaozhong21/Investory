import * as React from "react";

import { useNavigate } from "react-router-dom";

import useApi from "../auth/useApi";

const SearchBar = () => {
  const navigate = useNavigate();

  const [ticker, setTicker] = React.useState("");
  const { loading } = useApi();

  const canAdd = ticker !== "";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (canAdd) {
      setTicker("");
      navigate(`/stocks/${ticker}`);
    }
  };

  return loading ? null : (
    <form {...{ onSubmit }}>
      <label>
        <input
          onChange={(e) => setTicker(e.currentTarget.value)}
          value={ticker}
          placeholder="Search by Ticker"
        />
      </label>
      <button disabled={!canAdd}>Search</button>
    </form>
  );
};

export default SearchBar;
