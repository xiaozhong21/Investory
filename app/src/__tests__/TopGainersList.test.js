import React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import TopGainersList from "../Discover/TopGainersList";
import { useMyWatchlist } from "../myWatchlist.js";

const user = {
  email: "johndoe@me.com",
  email_verified: true,
  sub: "google-oauth2|12345678901234",
};

jest.mock("@auth0/auth0-react");
jest.mock("../myWatchlist.js");

const mockTopGainers = [
  {
    symbol: "RBLX",
    changePercent: 43.56,
    latestPrice: 113.91,
  },
  {
    symbol: "KPLT",
    changePercent: 39.503,
    latestPrice: 5.78,
  },
];

beforeEach(() => {
  // Mock the Auth0 hook and make it return a logged in state
  useAuth0.mockReturnValue({
    isAuthenticated: true,
    user,
    logout: jest.fn(),
    loginWithRedirect: jest.fn(),
  });
  useMyWatchlist.mockReturnValue({
    updateWatchListButton: (stock) => <button></button>,
  });
});

afterEach(() => {
  cleanup();
});

describe("Top Gainers", () => {
  test("renders top gainers component", () => {
    render(
      <BrowserRouter>
        <TopGainersList topGainers={mockTopGainers} />
      </BrowserRouter>,
    );
    screen.debug();
  });

  test("renders stock ticker correctly", async () => {
    render(
      <BrowserRouter>
        <TopGainersList topGainers={mockTopGainers} />
      </BrowserRouter>,
    );
    const stockTicker = await screen.findByText("RBLX");
    expect(stockTicker).toBeInTheDocument();
  });

  test("renders stock price info correctly", async () => {
    render(
      <BrowserRouter>
        <TopGainersList topGainers={mockTopGainers} />
      </BrowserRouter>,
    );
    const stockPrice = await screen.findByText("$113.91");
    expect(stockPrice).toBeInTheDocument();
  });
});
