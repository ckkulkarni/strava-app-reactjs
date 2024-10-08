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
import { http } from "../../utils/http";
const feature = loadFeature("src/components/features/createactivity.feature");
let store: any;
let screen: any;
jest.mock("axios");
const navigate = jest.fn();

jest.mock("../../utils/http");

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
          <CreateActivity />
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

  test("User fills out and submits the create activity form", ({
    given,
    when,
    then,
    and,
  }) => {
    given("the user is on the Create Activity page", () => {
      const mockLocalStorage = {
        getItem: jest.fn((key) => {
          if (key === "access_token") return "mock-token";
          return null;
        }),
        setItem: jest.fn(),
        clear: jest.fn(),
      };
      Object.defineProperty(window, "localStorage", {
        value: mockLocalStorage,
      });
      expect(screen).toBeDefined();
    });
    when(
      "the user enters the activity details and submits the form",
      async () => {
        const nameInput = screen.getByLabelText(/Name/i);
        const typeSelect = screen.getByLabelText(/Type/i);
        const startTimeInput = screen.getByLabelText(/Start Date/i);
        const elapsedTimeInput = screen.getByLabelText(/Elapsed Time/i);
        const distanceInput = screen.getByLabelText(/Distance/i);
        const createButton = screen.getByRole("button", { name: /Create/i });

        await act(async () => {
          fireEvent.change(nameInput, { target: { value: "Morning Run" } });
          fireEvent.change(typeSelect, { target: { value: "Run" } });
          fireEvent.change(startTimeInput, {
            target: { value: "2023-08-15T08:00" },
          });
          fireEvent.change(elapsedTimeInput, { target: { value: "1800" } });
          fireEvent.change(distanceInput, { target: { value: "5000" } });
        });

        act(() => {
          fireEvent.click(createButton);
        });
      }
    );
    then("the user should be redirected to the Activities page", async () => {
      await waitFor(() => {
        screen.debug();
      });
    });
  });
});
