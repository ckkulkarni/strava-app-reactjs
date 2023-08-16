import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: null as string | null,
    userID: ''
};

const stravaSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      },
      setUserID: (state, action) => {
          state.userID = action.payload
      },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, clearAccessToken, setUserID } = stravaSlice.actions;

export default stravaSlice.reducer;
