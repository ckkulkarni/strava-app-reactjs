import { defineFeature, loadFeature } from "jest-cucumber";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import "text-encoding";
import * as router from "react-router";
import { MemoryRouter } from "react-router-dom";
import HomeScreen from "../../pages/HomeScreen";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import stravaSlice from "../../redux/reducer/stravaSlice";
import withNavigate from "../../utils/navigation";

const feature = loadFeature("src/components/features/base.feature");

let store: any;
let screen: any;
const { REACT_APP_CLIENTID } = process.env;
const redirectUrl = "http://localhost:3000/redirect";
const scope = "read,activity:read,activity:write";
jest.mock("../../utils/navigation", () => (Component: any) => (props: any) => {
  const navigate = jest.fn();
  return <Component {...props} navigate={navigate} />;
});

const navigate = jest.fn();
jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);

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
          <HomeScreen />
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
      const loginButton = screen.getByTestId("login-button");
      act(() => {
        fireEvent.click(loginButton);
      });
    });

    then("I should be redirected to the Strava OAuth page", async () => {
      await waitFor(() =>
        expect(window.location.href).toBe(
          `http://www.strava.com/oauth/authorize?client_id=${REACT_APP_CLIENTID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`
        )
      );
    });
  });

  test("User is logged in and opens the app", ({ given, when, then, and }) => {
    const mockedNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockedNavigate,
    }));

    given("I am on the home page", () => {
      localStorage.setItem("access_token", "mock-token");
      const WrappedComponent: React.FC<any> = withNavigate(HomeScreen);

      screen.rerender(
        <Provider store={store}>
          <MemoryRouter>
            <WrappedComponent {...screen.props} />
          </MemoryRouter>
        </Provider>
      );

      expect(screen).toBeDefined();
    });

    and("I am already logged in", () => {
      const accessToken = localStorage.getItem("access_token");
      expect(accessToken).toBe("mock-token");
    });

    then('I should be redirected to the "Activities" screen', async () => {
      await waitFor(() => {
        expect(navigate).toHaveBeenCalled();
      });
    });
  });
});
