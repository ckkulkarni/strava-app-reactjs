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
import CreateActivity from "../../pages/CreateActivity";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import stravaSlice from "../../redux/reducer/stravaSlice";
const feature = loadFeature("src/components/features/createactivity.feature");
let store: any;
let screen: any;
jest.mock("axios");
const { REACT_APP_CLIENTID } = process.env;
const { REACT_APP_CLIENT_SECRET } = process.env;
const scope = "read,activity:read";
const navigate = jest.fn();
jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
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
          <CreateActivity />
        </MemoryRouter>
      </Provider>
    );
  });

  test("User fills out and submits the create activity form", ({
    given,
    when,
    then,
    and,
  }) => {
    given("the user is on the Create Activity page", () => {
      expect(screen).toBeDefined();
    });
    when(
      "the user enters the activity details and submits the form",
      async () => {
        const nameInput = screen
          .getByTestId("activity-name")
          .querySelector("input");
        const typeInput = screen
          .getByTestId("activity-type")
          .querySelector("input");
        const startTimeInput = screen
          .getByTestId("activity-date")
          .querySelector("input");
        const elapsedTimeInput = screen
          .getByTestId("elapsed-time")
          .querySelector("input");
        const distanceInput = screen
          .getByTestId("activity-distance")
          .querySelector("input");
        const createButton = screen.getByText("Create");

        await act(async () => {
          fireEvent.change(nameInput, { target: { value: "Morning Run" } });
          fireEvent.change(typeInput, { target: { value: "Run" } });
          fireEvent.change(startTimeInput, {
            target: { value: "2023-08-15T08:00" },
          });
          fireEvent.change(elapsedTimeInput, { target: { value: "1800" } });
          fireEvent.change(distanceInput, { target: { value: "5000" } });
          fireEvent.click(createButton);
        });
      }
    );
    then("the user should be redirected to the Activities page", async () => {
      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith("Activity Submitted");
      });
    });
  });
});
