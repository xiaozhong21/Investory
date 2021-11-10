import React from "react";

import { useAuth0 } from "@auth0/auth0-react";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Discover from "../Discover/index";

afterEach(cleanup);

const user = {
  email: "johndoe@me.com",
  email_verified: true,
  sub: "google-oauth2|12345678901234",
};

const mockTopGainers = [];
const fakeGetTopGainers = () => {
  return mockTopGainers;
};

jest.mock("@auth0/auth0-react");

describe("Discover", () => {
  beforeEach(() => {
    // Mock the Auth0 hook and make it return a logged in state
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user,
      logout: jest.fn(),
      loginWithRedirect: jest.fn(),
    });
  });

  test("renders discover component", async () => {
    render(
      <BrowserRouter>
        {/* <Protected component={Discover} /> */}
        <Discover />
      </BrowserRouter>,
    );
    screen.debug();
    const discoverElement = await screen.findByText("Top Gainers");
    expect(discoverElement).toBeInTheDocument();
  });
});
