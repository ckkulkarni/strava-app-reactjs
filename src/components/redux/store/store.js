import { configureStore } from "@reduxjs/toolkit";
import stravaSlice from "../reducer/stravaSlice";

export default configureStore({
  reducer: {
    strava: stravaSlice,
  },
});
