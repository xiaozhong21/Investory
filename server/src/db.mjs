import pgp from "pg-promise";

import { load_dotenv_if_exists } from "./utils.mjs";

load_dotenv_if_exists();

const db = initDb();

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

export const addOrUpdateStock = (stock) =>
  db.one(
    `
    INSERT INTO stocks(ticker, updated_at, company_name, market_cap, PE_ratio,
      week52_high, week52_low, YTD_change, volume, latest_price, change_percent)
    VALUES($<symbol>, NOW(), $<companyName>, $<marketCap>, $<peRatio>,
      $<week52High>, $<week52Low>, $<ytdChange>, $<volume>, $<latestPrice>,
      $<changePercent>)
    ON CONFLICT (ticker) DO UPDATE
      SET updated_at = NOW(), market_cap = $<marketCap>, PE_ratio = $<peRatio>,
      week52_high = $<week52High>, week52_low = $<week52Low>,
      YTD_change = $<ytdChange>, volume = $<volume>,
      latest_price = $<latestPrice>, change_percent = $<changePercent>
    RETURNING *
    `,
    stock,
  );

export const getWatchlist = (sub) =>
  db.any(
    "SELECT watchlist.*, stocks.* FROM watchlist LEFT JOIN stocks on stock_id=stocks.id LEFT JOIN users on user_id=users.id WHERE sub=$<sub>",
    { sub },
  );

export const addStockToWatchlist = (sub, ticker) =>
  db.one(
    `INSERT INTO watchlist(user_id, stock_id)
      VALUES((SELECT id FROM users WHERE sub=$<sub>), (SELECT id FROM stocks WHERE ticker=$<ticker>))
      RETURNING *`,
    { sub, ticker },
  );

export const deleteStockFromWatchlist = (sub, ticker) =>
  db.none(
    "DELETE FROM watchlist WHERE user_id = (SELECT id FROM users WHERE sub=$<sub>) AND stock_id = (SELECT id FROM stocks WHERE ticker=$<ticker>)",
    { sub, ticker },
  );

export const getPortfolios = (sub) =>
  db.any(
    "SELECT user_portfolio.* FROM user_portfolio LEFT JOIN users on user_id=users.id WHERE sub=$<sub>",
    { sub },
  );

export const addUserPortfolio = (sub) =>
  db.one(
    `INSERT INTO user_portfolio(user_id)
      VALUES((SELECT id FROM users WHERE sub=$<sub>))
      RETURNING *`,
    { sub },
  );

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

  return pgp()(connection);
}
