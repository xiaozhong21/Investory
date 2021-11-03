import * as React from "react";

import { useNavigate } from "react-router-dom";

import searchIcon from "./search.svg";

const SearchBar = () => {
  const navigate = useNavigate();

  const [ticker, setTicker] = React.useState("");

  const canAdd = ticker !== "";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (canAdd) {
      setTicker("");
      navigate(`/stocks/${ticker}`);
    }
  };

  return (
    <form {...{ onSubmit }}>
      <input
        onChange={(e) => setTicker(e.currentTarget.value)}
        value={ticker}
        placeholder="Search by Ticker"
        size="10"
      />
      <button disabled={!canAdd}>
        <img src={searchIcon} alt="magnifying glasses" />
      </button>
    </form>
  );
};

export default SearchBar;
