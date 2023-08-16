import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "text-encoding";
import * as router from "react-router";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  MemoryRouter,
} from "react-router-dom";
import Base from "../../pages/Base";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import stravaSlice from "../../redux/reducer/stravaSlice";
const feature = loadFeature("src/components/features/base.feature");
let store: any;
let screen: any;
const { REACT_APP_CLIENTID } = process.env;
const { REACT_APP_CLIENT_SECRET } = process.env;
const redirectUrl = "http://localhost:3000/redirect";
const scope = "read,activity:read";
defineFeature(feature, (test) => {
  beforeEach(() => {
    store = configureStore({
      reducer: {
        strava: stravaSlice,
      },
    });
    screen = render(
      <Provider store={store}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Base />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  });
  test('User is not logged in and clicks on "Login with Strava" button', ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am on the home page", () => {
      expect(screen).toBeDefined();
      const accessToken = localStorage.getItem("access_token");
      expect(accessToken).toBe(null);
    });
    when('I click on "Login With Strava" button', () => {
      const loginButton = screen.getByRole("button", {
        name: "Login With Strava",
      });
      act(() => {
        fireEvent.click(loginButton);
      });
    });
  });
  test("User is logged in and opens the app", ({ given, when, then, and }) => {
    const navigate = jest.fn();
    jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
    given("I am on the home page", () => {
      expect(screen).toBeDefined();
      localStorage.setItem("access_token", "mock-token");
    });
    and("I am already logged in", () => {
      const accessToken = localStorage.getItem("access_token");
      expect(accessToken).toBe("mock-token");
    });
    then('I should be redirected to the "Activities" screen', async () => {
      waitFor(() => {
        expect(navigate).toHaveBeenCalledWith("/activities");
      });
    });
  });
});
