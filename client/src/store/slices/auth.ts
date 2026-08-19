import { AuthInitialState } from "@/constants/store";
import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

export const slice = createSlice({
  name: "auth",
  initialState: AuthInitialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isLoading = false;
      state.user = {
        _id: "",
        name: "",
        username: "",
        email: "",
        avatar: "",
      };
    },
    setUser(state, action) {
      state.user = action.payload.user;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state) => {
      state.isLoading = false;
    });
  },
});

export const { login, logout, setUser, setIsLoading } = slice.actions;

export default slice.reducer;
