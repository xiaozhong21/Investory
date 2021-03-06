import pgPromise from "pg-promise";

import { load_dotenv_if_exists } from "./utils.mjs";

load_dotenv_if_exists();

const pgp = pgPromise();
const db = initDb();

export const getWatchlist = (sub) =>
  db.any(
    "SELECT watchlist.* FROM watchlist LEFT JOIN users on user_id=users.id WHERE sub=$<sub>",
    { sub },
  );

export const getPortfolios = (sub) =>
  db.any(
    "SELECT * FROM user_portfolio LEFT JOIN users on user_id=users.id WHERE sub=$<sub>",
    { sub },
  );

export const getPortfolio = (portfolioID) =>
  db.one("SELECT * FROM user_portfolio WHERE portfolio_id=$<portfolioID>", {
    portfolioID,
  });

export const getPortfolioStocks = (portfolioID) =>
  db.any(
    "SELECT * FROM portfolio_stock ps LEFT JOIN user_portfolio up on ps.portfolio_id = up.portfolio_id WHERE up.portfolio_id = $<portfolioID>",
    { portfolioID },
  );

export const addOrUpdateUser = (user) =>
  db.one(
    `INSERT INTO users(given_name, family_name, picture, email, sub)
      VALUES($<given_name>, $<family_name>, $<picture>, $<email>, $<sub>)
      ON CONFLICT (sub) DO
        UPDATE SET given_name = $<given_name>, family_name = $<family_name>,
          picture = $<picture>, email=$<email>
      RETURNING *`,
    user,
  );

export const addStockToWatchlist = (sub, ticker) =>
  db.one(
    `INSERT INTO watchlist(user_id, ticker)
      VALUES((SELECT id FROM users WHERE sub=$<sub>), $<ticker>)
      RETURNING *`,
    { sub, ticker },
  );

export const addUserPortfolio = (sub, portfolio) =>
  db.one(
    `INSERT INTO user_portfolio(user_id, portfolio_name, time_period, initial_amount)
      VALUES((SELECT id FROM users WHERE sub=$<sub>), $<portfolioName>, $<timePeriod>, $<initialAmount>)
      RETURNING *`,
    { sub, ...portfolio },
  );

export const addPortfolioStocks = (stocksArray) => {
  const columnSet = new pgp.helpers.ColumnSet(
    ["portfolio_id", "ticker", "allocation"],
    { table: "portfolio_stock" },
  );
  db.none(pgp.helpers.insert(stocksArray, columnSet));
};

export const updateUserPortfolio = (portfolioID, portfolio) =>
  db.one(
    `UPDATE user_portfolio
      SET portfolio_name=$<portfolioName>, time_period=$<timePeriod>, initial_amount=$<initialAmount>
      WHERE portfolio_id=$<portfolioID>
      RETURNING *`,
    { portfolioID, ...portfolio },
  );

export const deleteStockFromWatchlist = (sub, ticker) =>
  db.none(
    "DELETE FROM watchlist WHERE user_id = (SELECT id FROM users WHERE sub=$<sub>) AND ticker=$<ticker>",
    { sub, ticker },
  );

export const deletePortfolio = (portfolioID) =>
  db.none("DELETE FROM user_portfolio WHERE portfolio_id = $<portfolioID>", {
    portfolioID,
  });

export const deletePortfolioStocks = (portfolioID) =>
  db.any("DELETE FROM portfolio_stock WHERE portfolio_id = $<portfolioID>", {
    portfolioID,
  });

function initDb() {
  let connection;

  if (process.env.DATABASE_URL === undefined) {
    connection = {
      user: "postgres",
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: 5442,
    };
  } else {
    connection = {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  }

  return pgPromise()(connection);
}
