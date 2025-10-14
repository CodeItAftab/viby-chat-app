import { AuthInitialState } from "@/constants/store";
import { createSlice } from "@reduxjs/toolkit";

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
});

export const { login, logout, setUser, setIsLoading } = slice.actions;

export default slice.reducer;
