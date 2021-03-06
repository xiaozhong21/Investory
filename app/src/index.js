import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import AuthProvider from "./auth/AuthProvider";
import { MyWatchlistProvider } from "./myWatchlist";
import reportWebVitals from "./reportWebVitals";

import "./global.scss";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <MyWatchlistProvider>
          <App />
        </MyWatchlistProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
