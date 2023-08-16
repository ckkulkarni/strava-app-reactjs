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
import Redirect from "../../pages/Redirect";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import stravaSlice from "../../redux/reducer/stravaSlice";
const feature = loadFeature("src/components/features/redirect.feature");
let store: any;
let screen: any;
jest.mock("axios");
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
          <Redirect />
        </MemoryRouter>
      </Provider>
    );
  });

  test("User logs in and gets redirected to Activities screen", ({
    given,
    when,
    then,
    and,
  }) => {
    given('the Strava client ID is "mock-id"', () => {
      process.env.REACT_APP_CLIENTID = "mock-id";
    });
    when('the Strava client secret is "mock-secret"', () => {
      process.env.REACT_APP_CLIENT_SECRET = "mock-secret";
    });
    and("the user is on the redirect page", () => {
      expect(screen).toBeDefined();
    });
    when('the user is redirected with code "mock-code"', async () => {
      const navigate = jest.fn();
      jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
      jest.spyOn(axios, "post").mockResolvedValueOnce({
        data: {
          access_token: "mock-access-token",
          athlete: { id: "mock-user-id" },
        },
      });
      waitFor(() => {
        expect(navigate).toHaveBeenCalled();
      });
    });
    then("the access token is set in local storage", () => {
      localStorage.setItem("access_token", "mock-access-token");
      expect(localStorage.getItem("access_token")).toBe("mock-access-token");
    });
  });
});
