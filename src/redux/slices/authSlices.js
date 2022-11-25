import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    isSignedIn: false,
    username: "",
    photoURL: "",
  },
};

export const authSlices = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state, action) => {
      state.user = initialState.user;  
    },
  },
});

//Generate the action creators
export const { setUser, clearUser } = authSlices.actions;

//Export reducers
export default authSlices.reducer;
