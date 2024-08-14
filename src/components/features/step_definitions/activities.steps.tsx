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
import Activities from "../../pages/Activities";
import axios, { AxiosResponse } from "axios";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import stravaSlice from "../../redux/reducer/stravaSlice";
import { http } from "../../utils/http";
import withNavigate from "../../utils/navigation";
const feature = loadFeature("src/components/features/activities.feature");
let store: any;
let screen: any;

const navigate = jest.fn();
jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
jest.mock("../../utils/http");
defineFeature(feature, (test) => {
  let originalWindowLocation = window.location;

  Object.defineProperty(window, "location", {
    configurable: true,
    enumerable: true,
    value: new URL(window.location.href),
  });

  const mockActivities = [
    {
      id: 1,
      name: "Morning Run",
      type: "Run",
      distance: 2000,
      average_speed: 2.5,
      max_speed: 5.0,
    },
    {
      id: 2,
      name: "Evening Run",
      type: "Run",
      distance: 1000,
      average_speed: 1.3,
      max_speed: 2.0,
    },
  ];
  beforeEach(() => {
    localStorage.clear();
    store = configureStore({
      reducer: {
        strava: stravaSlice,
      },
    });
    const WrappedComponent: React.FC<any> = withNavigate(Activities);
    (http.get as jest.Mock).mockResolvedValue({
      data: mockActivities,
    } as AxiosResponse);
    screen = render(
      <Provider store={store}>
        <MemoryRouter>
          <WrappedComponent />
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

  // (axios.get as jest.Mock).mockResolvedValueOnce({
  //   data: mockActivities,
  // });

  test("User sees a list of activities", ({ given, when, then, and }) => {
    given("the user is on the Activities page", () => {
      // localStorage.setItem("access_token", "mock-token");
      localStorage.setItem("access_token", "mock-token");
      screen.rerender(
        <Provider store={store}>
          <MemoryRouter>
            <Activities />
          </MemoryRouter>
        </Provider>
      );
      expect(screen).toBeDefined();
    });
    when("the user's activities are fetched", async () => {
      const accessToken = localStorage.getItem("access_token");
      expect(accessToken).toBe("mock-token");
    });
    then("the user should see a list of activities", async () => {
      await waitFor(() => {
        const activityList = screen.getByTestId("activity-container");
        expect(activityList).toBeInTheDocument();
        const activityCard = screen.getByText("Morning Run");
        expect(activityCard).toBeDefined();
        const sportsType = screen.getAllByText("Run");
        expect(sportsType).toBeDefined();
        const distance = screen.getByText("2000 meters");
        expect(distance).toBeInTheDocument();
        const avgSpeed = screen.getByText("2.5 m/s");
        expect(avgSpeed).toBeInTheDocument();
        const maxSpeed = screen.getByText("5 m/s");
        expect(maxSpeed).toBeInTheDocument();
      });
    });
  });

  test('User clicks on "Create Activity" button', ({
    given,
    when,
    then,
    and,
  }) => {
    given("the user is on the Activities page", () => {
      expect(screen).toBeDefined();
    });
    when('the user clicks on the "Create Activity" button', () => {
      const createActivityButton = screen.getByRole("link", {
        name: "Create Activity",
      });
      act(() => {
        fireEvent.click(createActivityButton);
      });
    });
    then(
      'the user should be redirected to the "Create Activity" page',
      async () => {
        await waitFor(() => {
          expect(navigate).toHaveBeenCalled();
        });
      }
    );
  });
});
