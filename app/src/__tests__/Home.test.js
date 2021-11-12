import React from "react";

import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import Home from "../Home/index";

afterEach(cleanup);

describe("<Home />", () => {
  test("renders home component", () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );
    const homeElement = screen.getByTestId("home");
    expect(homeElement).toBeInTheDocument();
    expect(homeElement).toHaveTextContent("Own Your Investment Story");
  });
});
