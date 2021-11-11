import React from "react";

import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Nav from "../../src/widgets/Nav/index";

afterEach(cleanup);

describe("Nav", () => {
  test("renders login button", () => {
    render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>,
    );
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  test("renders search bar", () => {
    render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>,
    );
    expect(
      screen.getByPlaceholderText(/search by ticker/i),
    ).toBeInTheDocument();
  });
});
