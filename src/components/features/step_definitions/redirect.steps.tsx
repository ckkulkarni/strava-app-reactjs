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
const navigate = jest.fn();

jest.mock("../../utils/http");

jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
jest.mock("axios");
defineFeature(feature, (test) => {
  let originalWindowLocation = window.location;

  Object.defineProperty(window, "location", {
    configurable: true,
    enumerable: true,
    value: new URL(window.location.href),
  });

  beforeEach(() => {
    localStorage.clear();
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
  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      enumerable: true,
      value: originalWindowLocation,
    });
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
      jest.spyOn(axios, "post").mockResolvedValueOnce({
        data: {
          access_token: "mock-access-token",
          athlete: { id: "mock-user-id" },
        },
      });
    });
    then("the access token is set in local storage", () => {
      localStorage.setItem("access_token", "mock-access-token");
      expect(localStorage.getItem("access_token")).toBe("mock-access-token");
    });
  });
});
